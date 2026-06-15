import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PatternType, PatternStatus } from '@prisma/client';

interface DetectedPattern {
  type: PatternType;
  name: string;
  description: string;
  confidence: number;
  triggers: string[];
  evidenceIds: string[];
}

const DETECT_TOOL = {
  name: 'report_patterns',
  description: 'Report detected psychological patterns from the provided evidence',
  input_schema: {
    type: 'object',
    properties: {
      patterns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['EMOTIONAL', 'BEHAVIORAL', 'RELATIONAL', 'COGNITIVE', 'SOMATIC', 'CYCLICAL', 'CONTEXTUAL'] },
            name: { type: 'string' },
            description: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            triggers: { type: 'array', items: { type: 'string' } },
          },
          required: ['type', 'name', 'description', 'confidence', 'triggers'],
        },
      },
    },
    required: ['patterns'],
  },
};

@Injectable()
export class PatternService {
  private readonly logger = new Logger(PatternService.name);
  private readonly anthropic: Anthropic;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.anthropic = new Anthropic({ apiKey: this.config.getOrThrow<string>('anthropic.apiKey') });
  }

  async detectFromEvidence(
    userId: string,
    organizationId: string,
    evidenceIds: string[],
    evidenceTexts: string[],
  ): Promise<void> {
    const prompt = `Analyze these journal/conversation excerpts and detect recurring psychological patterns:

${evidenceTexts.map((t, i) => `[${i + 1}] ${t}`).join('\n\n')}

Identify cognitive distortions, emotional patterns, behavioral tendencies, relational dynamics, or somatic patterns. Only report patterns with confidence >= 0.5.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      tools: [DETECT_TOOL as any],
      tool_choice: { type: 'tool', name: 'report_patterns' },
      messages: [{ role: 'user', content: prompt }],
    });

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') return;

    const detected = (toolUse.input as any).patterns as DetectedPattern[];

    for (const p of detected) {
      const existing = await this.prisma.psychologicalPattern.findFirst({
        where: { userId, organizationId, name: p.name, status: { not: PatternStatus.ARCHIVED } },
      });

      if (existing) {
        await this.prisma.psychologicalPattern.update({
          where: { id: existing.id },
          data: {
            confidence: (existing.confidence + p.confidence) / 2,
            occurrenceCount: { increment: 1 },
            evidenceIds: { set: [...new Set([...existing.evidenceIds, ...evidenceIds])] },
            lastDetected: new Date(),
          },
        });
      } else {
        await this.prisma.psychologicalPattern.create({
          data: {
            userId,
            organizationId,
            type: p.type as PatternType,
            name: p.name,
            description: p.description,
            confidence: p.confidence,
            triggers: p.triggers,
            evidenceIds,
            firstDetected: new Date(),
            lastDetected: new Date(),
            occurrenceCount: 1,
            userAcknowledged: false,
          },
        });
      }
    }
  }

  async list(userId: string, organizationId: string, status?: PatternStatus) {
    return this.prisma.psychologicalPattern.findMany({
      where: {
        userId,
        organizationId,
        ...(status ? { status } : {}),
      },
      orderBy: [{ confidence: 'desc' }, { lastDetected: 'desc' }],
    });
  }

  async acknowledge(patternId: string, userId: string) {
    const pattern = await this.prisma.psychologicalPattern.findFirst({
      where: { id: patternId, userId },
    });
    if (!pattern) throw new NotFoundException('Pattern not found');

    return this.prisma.psychologicalPattern.update({
      where: { id: patternId },
      data: { userAcknowledged: true },
    });
  }

  async resolve(patternId: string, userId: string) {
    const pattern = await this.prisma.psychologicalPattern.findFirst({
      where: { id: patternId, userId },
    });
    if (!pattern) throw new NotFoundException('Pattern not found');

    return this.prisma.psychologicalPattern.update({
      where: { id: patternId },
      data: { status: PatternStatus.ARCHIVED },
    });
  }
}
