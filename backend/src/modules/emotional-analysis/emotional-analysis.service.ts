import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { EmotionalState, SafetySignals } from '../living-mind/living-mind.types';

export interface EmotionalAnalysisResult {
  emotionalState: EmotionalState;
  safetySignals: SafetySignals;
  mentionedRelationships: string[];
  topics: string[];
  keywords: string[];
}

const EMOTION_ANALYSIS_TOOL: Anthropic.Tool = {
  name: 'analyze_emotional_content',
  description:
    'Analyze the emotional content, safety signals, and contextual elements of a user message for an AI wellness companion.',
  input_schema: {
    type: 'object' as const,
    properties: {
      valence: {
        type: 'number',
        description: 'Overall emotional valence from -1 (very negative) to 1 (very positive)',
      },
      arousal: {
        type: 'number',
        description: 'Activation level from 0 (calm/flat) to 1 (highly activated/agitated)',
      },
      groundedness: {
        type: 'number',
        description: 'How present and grounded the person seems, 0 (dissociated/overwhelmed) to 1 (fully present)',
      },
      dominant_emotions: {
        type: 'array',
        items: { type: 'string' },
        description:
          'List of specific emotions detected: e.g. anxious, frustrated, hopeful, ashamed, lonely, numb, grieving, content, angry, confused',
      },
      intensity: {
        type: 'number',
        description: 'Overall emotional intensity from 0 (very mild) to 1 (extremely intense)',
      },
      safety_signals: {
        type: 'object',
        properties: {
          crisis_detected: {
            type: 'boolean',
            description: 'True if any crisis signals are present (suicidal ideation, self-harm, danger)',
          },
          tier: {
            type: 'number',
            description: '0=none, 1=mild distress, 2=elevated risk, 3=acute crisis',
          },
          confidence: {
            type: 'number',
            description: 'Confidence in the safety assessment, 0 to 1',
          },
          signals: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of specific signals detected, e.g. "hopelessness language", "farewell themes"',
          },
        },
        required: ['crisis_detected', 'tier', 'confidence', 'signals'],
      },
      mentioned_relationships: {
        type: 'array',
        items: { type: 'string' },
        description: 'Names or labels of people mentioned (e.g. "my mom", "my partner", "my boss")',
      },
      topics: {
        type: 'array',
        items: { type: 'string' },
        description: 'Main topics in the message: e.g. work, family, relationship, health, grief, career, anxiety',
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: 'Significant words for memory retrieval (3–8 specific, meaningful words)',
      },
    },
    required: [
      'valence',
      'arousal',
      'groundedness',
      'dominant_emotions',
      'intensity',
      'safety_signals',
      'mentioned_relationships',
      'topics',
      'keywords',
    ],
  },
};

@Injectable()
export class EmotionalAnalysisService {
  private readonly logger = new Logger(EmotionalAnalysisService.name);
  private readonly client: Anthropic;
  private readonly fastModel: string;

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({ apiKey: config.getOrThrow('ANTHROPIC_API_KEY') });
    this.fastModel = config.get('ANTHROPIC_MODEL_FAST', 'claude-haiku-4-5-20251001');
  }

  async analyze(userMessage: string): Promise<EmotionalAnalysisResult> {
    try {
      const response = await this.client.messages.create({
        model: this.fastModel,
        max_tokens: 512,
        tools: [EMOTION_ANALYSIS_TOOL],
        tool_choice: { type: 'tool', name: 'analyze_emotional_content' },
        messages: [
          {
            role: 'user',
            content: `Analyze the emotional content of this message from a wellness app user:\n\n"${userMessage}"`,
          },
        ],
      });

      const toolUse = response.content.find((c) => c.type === 'tool_use');
      if (!toolUse || toolUse.type !== 'tool_use') {
        return this.fallbackAnalysis();
      }

      const raw = toolUse.input as any;

      return {
        emotionalState: {
          valence: this.clamp(raw.valence, -1, 1),
          arousal: this.clamp(raw.arousal, 0, 1),
          groundedness: this.clamp(raw.groundedness, 0, 1),
          dominantEmotions: raw.dominant_emotions ?? [],
          intensity: this.clamp(raw.intensity, 0, 1),
          updatedAt: new Date().toISOString(),
        },
        safetySignals: {
          crisisDetected: raw.safety_signals.crisis_detected,
          tier: raw.safety_signals.tier as 0 | 1 | 2 | 3,
          confidence: this.clamp(raw.safety_signals.confidence, 0, 1),
          signals: raw.safety_signals.signals ?? [],
        },
        mentionedRelationships: raw.mentioned_relationships ?? [],
        topics: raw.topics ?? [],
        keywords: raw.keywords ?? [],
      };
    } catch (err) {
      this.logger.error('Emotional analysis failed, using fallback', err);
      return this.fallbackAnalysis();
    }
  }

  private clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val ?? 0));
  }

  private fallbackAnalysis(): EmotionalAnalysisResult {
    return {
      emotionalState: {
        valence: 0,
        arousal: 0.5,
        groundedness: 0.7,
        dominantEmotions: [],
        intensity: 0.3,
        updatedAt: new Date().toISOString(),
      },
      safetySignals: {
        crisisDetected: false,
        tier: 0,
        confidence: 0,
        signals: [],
      },
      mentionedRelationships: [],
      topics: [],
      keywords: [],
    };
  }
}
