export const QUEUE_NAMES = {
  MEMORY_PROCESSING:    'memory-processing',
  EMOTION_ANALYSIS:     'emotion-analysis',
  PATTERN_DETECTION:    'pattern-detection',
  INSIGHT_GENERATION:   'insight-generation',
  PREDICTION_ENGINE:    'prediction-engine',
  VOICE_TRANSCRIPTION:  'voice-transcription',
  NOTIFICATION_DISPATCH:'notification-dispatch',
  REPORT_GENERATION:    'report-generation',
  AI_COMPLETION:        'ai-completion',
  LMM_UPDATE:           'lmm-update',
  EMBEDDING_GENERATION: 'embedding-generation',
  DECAY_PROCESSING:     'decay-processing',
  SAFETY_ESCALATION:    'safety-escalation',
  BILLING_EVENTS:       'billing-events',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

export const JOB_NAMES = {
  // Memory
  STORE_EPISODE:           'store-episode',
  UPDATE_MEMORY_DECAY:     'update-memory-decay',
  CLUSTER_MEMORIES:        'cluster-memories',
  GENERATE_MEMORY_EMBEDDING: 'generate-memory-embedding',

  // Emotion
  ANALYZE_EMOTION:         'analyze-emotion',
  UPDATE_EMOTIONAL_STATE:  'update-emotional-state',
  CREATE_EMOTIONAL_EVENT:  'create-emotional-event',

  // Pattern
  DETECT_PATTERNS:         'detect-patterns',
  CONFIRM_PATTERN:         'confirm-pattern',
  ARCHIVE_PATTERN:         'archive-pattern',

  // Insight
  GENERATE_INSIGHT:        'generate-insight',
  GENERATE_GROWTH_REPORT:  'generate-growth-report',
  GENERATE_WEEKLY_REPORT:  'generate-weekly-report',

  // Prediction
  RUN_PREDICTIONS:         'run-predictions',
  EVALUATE_PREDICTION:     'evaluate-prediction',

  // Voice
  TRANSCRIBE_VOICE:        'transcribe-voice',
  ANALYZE_VOICE_EMOTION:   'analyze-voice-emotion',

  // Notifications
  SEND_PUSH:               'send-push',
  SEND_EMAIL:              'send-email',
  SCHEDULE_CHECK_IN_REMINDER: 'schedule-check-in-reminder',

  // Reports
  GENERATE_MONTHLY_REPORT: 'generate-monthly-report',
  GENERATE_ANNUAL_REPORT:  'generate-annual-report',

  // AI
  AI_COMPLETION:           'ai-completion',
  GENERATE_EMBEDDING:      'generate-embedding',
  INDEX_EMBEDDING:         'index-embedding',

  // LMM
  UPDATE_LMM:              'update-lmm',
  SNAPSHOT_LMM:            'snapshot-lmm',
  UPDATE_TRAITS:           'update-traits',
  DETECT_PHASE_TRANSITION: 'detect-phase-transition',

  // Safety
  ESCALATE_SAFETY:         'escalate-safety',
  FIRE_SAFETY_WEBHOOK:     'fire-safety-webhook',

  // Billing
  SYNC_STRIPE_EVENT:       'sync-stripe-event',
  PROVISION_SUBSCRIPTION:  'provision-subscription',
} as const;

export type JobName = typeof JOB_NAMES[keyof typeof JOB_NAMES];
