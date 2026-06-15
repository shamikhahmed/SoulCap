import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class GrowthReportService {
  private readonly logger = new Logger(GrowthReportService.name);
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.anthropic = new Anthropic({ apiKey: this.config.getOrThrow<string>('anthropic.apiKey') });
  }

  async generateMonthly(userId: string, organizationId: string, year: number, month: number) {
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59);

    const existing = await this.prisma.growthReport.findFirst({
      where: { userId, organizationId, reportType: 'MONTHLY', periodStart, periodEnd },
    });
    if (existing) return existing;

    const [checkIns, goals, habits, patterns, insights] = await Promise.all([
      this.prisma.checkIn.findMany({
        where: { userId, organizationId, createdAt: { gte: periodStart, lte: periodEnd } },
        select: { valence: true, energyLevel: true, freeText: true, createdAt: true },
      }),
      this.prisma.goal.findMany({
        where: { userId, organizationId, updatedAt: { gte: periodStart, lte: periodEnd } },
        select: { title: true, progress: true, status: true, domain: true },
      }),
      this.prisma.habit.findMany({
        where: { userId, organizationId },
        select: { name: true, streakCurrent: true, totalLogs: true },
      }),
      this.prisma.psychologicalPattern.findMany({
        where: { userId, organizationId, firstDetected: { gte: periodStart, lte: periodEnd } },
        select: { name: true, type: true, confidence: true },
      }),
      this.prisma.insight.findMany({
        where: { userId, organizationId, createdAt: { gte: periodStart, lte: periodEnd } },
        select: { title: true, type: true, userReaction: true },
      }),
    ]);

    const contextSummary = JSON.stringify({
      period: `${year}-${String(month).padStart(2, '0')}`,
      checkInCount: checkIns.length,
      avgMood: checkIns.length ? checkIns.reduce((s, c) => s + (c.valence ?? 0), 0) / checkIns.length : null,
      avgEnergy: checkIns.length ? checkIns.reduce((s, c) => s + (c.energyLevel ?? 0), 0) / checkIns.length : null,
      goals: goals.map((g) => ({ title: g.title, progress: g.progress, status: g.status, domain: g.domain })),
      habits: habits.map((h) => ({ name: h.name, streak: h.streakCurrent, logs: h.totalLogs })),
      newPatterns: patterns.map((p) => ({ name: p.name, type: p.type })),
      insights: insights.map((i) => ({ title: i.title, reaction: i.userReaction })),
    });

    const prompt = `Write a warm, compassionate monthly growth report for someone on their emotional wellness journey.

Data for the period:
${contextSummary}

Generate a JSON response with these exact keys:
- title: string (personalized report title)
- narrative: string (2-4 paragraphs, warm narrative overview of their month)
- achievements: string[] (list of concrete achievements, max 5)
- areasOfGrowth: string[] (areas where growth is visible, max 4)
- recommendations: string[] (gentle, actionable suggestions for next month, max 3)
- metrics: object (key stats: checkIns, avgMood, goalsProgressed, habitsActive)

IMPORTANT: Do NOT provide medical diagnoses. Do NOT claim to be a therapist. Be encouraging and growth-focused.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    let parsed: any = {};
    try {
      const jsonMatch = text.match(/\{[\s\S]+\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      this.logger.warn('Failed to parse growth report JSON');
    }

    const report = await this.prisma.growthReport.create({
      data: {
        userId,
        organizationId,
        reportType: 'MONTHLY',
        periodStart,
        periodEnd,
        title: parsed.title ?? `Your ${year}-${String(month).padStart(2, '0')} Growth Report`,
        narrative: parsed.narrative ?? '',
        metrics: parsed.metrics ?? {},
        achievements: parsed.achievements ?? [],
        areasOfGrowth: parsed.areasOfGrowth ?? [],
        recommendations: parsed.recommendations ?? [],
        modelUsed: 'claude-sonnet-4-6',
      },
    });

    return report;
  }

  async list(userId: string, organizationId: string) {
    return this.prisma.growthReport.findMany({
      where: { userId, organizationId },
      orderBy: { periodStart: 'desc' },
      take: 24,
    });
  }

  async getById(reportId: string, userId: string) {
    const report = await this.prisma.growthReport.findFirst({
      where: { id: reportId, userId },
    });
    if (!report) throw new NotFoundException('Growth report not found');
    return report;
  }
}
