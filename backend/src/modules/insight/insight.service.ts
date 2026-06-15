import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../database/prisma/prisma.service';
import { InsightType } from '@prisma/client';

const INSIGHT_TOOL = {
  name: 'generate_insights',
  description: 'Generate personalized psychological insights from the provided context',
  input_schema: {
    type: 'object',
    properties: {
      insights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['PATTERN', 'GROWTH', 'ACHIEVEMENT', 'RISK', 'RECOMMENDATION', 'MILESTONE'],
            },
            title: { type: 'string' },
            content: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            relatedTopics: { type: 'array', items: { type: 'string' } },
          },
          required: ['type', 'title', 'content', 'confidence', 'relatedTopics'],
        },
      },
    },
    required: ['insights'],
  },
};

@Injectable()
export class InsightService {
  private readonly logger = new Logger(InsightService.name);
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.anthropic = new Anthropic({ apiKey: this.config.getOrThrow<string>('anthropic.apiKey') });
  }

  async generateFromContext(
    userId: string,
    organizationId: string,
    contextSummary: string,
    evidenceIds: string[],
  ): Promise<void> {
    const recent = await this.prisma.insight.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { title: true },
    });

    const existingTitles = recent.map((i) => i.title).join(', ');

    const prompt = `Generate 1-3 personalized psychological insights based on this context about a user's emotional journey.

Context:
${contextSummary}

Already generated recently (avoid duplication): ${existingTitles || 'none'}

Focus on actionable, compassionate insights. Avoid being preachy. Do NOT provide medical diagnoses or claim to be a therapist. Only generate insights with confidence >= 0.6.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      tools: [INSIGHT_TOOL as any],
      tool_choice: { type: 'tool', name: 'generate_insights' },
      messages: [{ role: 'user', content: prompt }],
    });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') return;

    const generated = (toolUse.input as any).insights;

    for (const ins of generated) {
      await this.prisma.insight.create({
        data: {
          userId,
          organizationId,
          type: ins.type as InsightType,
          title: ins.title,
          content: ins.content,
          confidence: ins.confidence,
          relatedTopics: ins.relatedTopics,
          evidenceIds,
          userSeen: false,
        },
      });
    }
  }

  async list(userId: string, organizationId: string, unreadOnly = false) {
    return this.prisma.insight.findMany({
      where: {
        userId,
        organizationId,
        ...(unreadOnly ? { userSeen: false } : {}),
      },
      orderBy: [{ userSeen: 'asc' }, { confidence: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });
  }

  async markSeen(insightId: string, userId: string) {
    const insight = await this.prisma.insight.findFirst({ where: { id: insightId, userId } });
    if (!insight) throw new NotFoundException('Insight not found');
    return this.prisma.insight.update({ where: { id: insightId }, data: { userSeen: true } });
  }

  async react(insightId: string, userId: string, reaction: string) {
    const insight = await this.prisma.insight.findFirst({ where: { id: insightId, userId } });
    if (!insight) throw new NotFoundException('Insight not found');
    return this.prisma.insight.update({
      where: { id: insightId },
      data: { userReaction: reaction, userSeen: true },
    });
  }
}
