export const EMOTION_ANALYSIS_TOOL = {
  name: 'analyze_emotional_content',
  description: 'Extract structured emotional and safety signals from a user message in a mental wellness context.',
  input_schema: {
    type: 'object',
    required: ['valence', 'arousal', 'groundedness', 'dominant_emotions', 'intensity', 'safety_signals', 'mentioned_relationships', 'topics', 'keywords'],
    properties: {
      valence: { type: 'number', description: 'Overall emotional valence from -1 (very negative) to 1 (very positive)' },
      arousal: { type: 'number', description: 'Emotional activation 0 (calm/flat) to 1 (highly activated)' },
      groundedness: { type: 'number', description: 'How grounded/present user seems 0 (dissociated) to 1 (fully present)' },
      dominant_emotions: { type: 'array', items: { type: 'string' }, description: 'Primary emotions present (anger, sadness, anxiety, shame, joy, grief, fear, etc.)' },
      intensity: { type: 'number', description: 'Emotional intensity 0 to 1' },
      safety_signals: {
        type: 'object',
        required: ['crisis_detected', 'tier', 'confidence', 'signals'],
        properties: {
          crisis_detected: { type: 'boolean' },
          tier: { type: 'integer', enum: [0, 1, 2, 3], description: '0=none, 1=mild, 2=elevated, 3=crisis' },
          confidence: { type: 'number', description: '0 to 1' },
          signals: { type: 'array', items: { type: 'string' }, description: 'Specific phrases or patterns that triggered the assessment' },
        },
      },
      mentioned_relationships: { type: 'array', items: { type: 'string' }, description: 'People mentioned (partner, mother, friend, therapist, etc.)' },
      topics: { type: 'array', items: { type: 'string' }, description: 'Main topics (work, relationships, sleep, trauma, identity, etc.)' },
      keywords: { type: 'array', items: { type: 'string' }, description: 'Significant words or phrases for memory retrieval' },
    },
  },
};
