export default () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    allowedOrigins: process.env.ALLOWED_ORIGINS ?? '*',
    apiVersion: 'v1',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true',
    keyPrefix: 'lm:',
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    primaryModel: process.env.ANTHROPIC_PRIMARY_MODEL ?? 'claude-sonnet-4-6',
    analysisModel: process.env.ANTHROPIC_ANALYSIS_MODEL ?? 'claude-haiku-4-5-20251001',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS ?? '600', 10),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    primaryModel: process.env.OPENAI_PRIMARY_MODEL ?? 'gpt-4o',
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    embeddingDimension: parseInt(process.env.OPENAI_EMBEDDING_DIMENSION ?? '1536', 10),
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.AWS_REGION ?? process.env.S3_REGION ?? 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET ?? process.env.S3_BUCKET ?? 'living-mind',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? process.env.S3_SECRET_ACCESS_KEY,
    cdnUrl: process.env.S3_CDN_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    priceIds: {
      proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      proAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL,
      teamMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
    },
  },
  posthog: {
    apiKey: process.env.POSTHOG_API_KEY,
    host: process.env.POSTHOG_HOST ?? 'https://app.posthog.com',
  },
  apns: {
    keyId: process.env.APNS_KEY_ID,
    teamId: process.env.APNS_TEAM_ID,
    key: process.env.APNS_KEY ?? process.env.APNS_PRIVATE_KEY,
    bundleId: process.env.APNS_BUNDLE_ID ?? 'com.livingmind.app',
    production: process.env.NODE_ENV === 'production',
  },
  safety: {
    webhookUrl: process.env.SAFETY_WEBHOOK_URL,
    escalationEmail: process.env.SAFETY_ESCALATION_EMAIL,
  },
  encryption: {
    dataKey: process.env.DATA_ENCRYPTION_KEY,
    algorithm: 'aes-256-gcm',
  },
  idempotency: {
    ttlSeconds: 60,
    prefix: 'idmp:',
  },
  queues: {
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  },
});
