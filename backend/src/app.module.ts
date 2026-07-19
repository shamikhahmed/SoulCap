import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma/prisma.module';
import { RedisModule } from './cache/redis/redis.module';
import { BullMQModule } from './queue/bullmq/bullmq.module';
import { AiModule } from './ai/ai.module';
import { S3Module } from './storage/s3/s3.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { LivingMindModule } from './modules/living-mind/living-mind.module';
import { MemoryModule } from './modules/memory/memory.module';
import { HabitModule } from './modules/habit/habit.module';
import { GoalModule } from './modules/goal/goal.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { JournalModule } from './modules/journal/journal.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BillingModule } from './modules/billing/billing.module';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { VoiceModule } from './modules/voice/voice.module';
import { PatternModule } from './modules/pattern/pattern.module';
import { InsightModule } from './modules/insight/insight.module';
import { GrowthReportModule } from './modules/growth-report/growth-report.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { LmmUpdateProcessor } from './queue/processors/lmm-update.processor';
import { EmbeddingProcessor } from './queue/processors/embedding.processor';
import { DecayProcessor } from './queue/processors/decay.processor';
import { NotificationProcessor } from './queue/processors/notification.processor';
import { SafetyEscalationProcessor } from './queue/processors/safety-escalation.processor';
import { PatternDetectionProcessor } from './queue/processors/pattern-detection.processor';
import { InsightGenerationProcessor } from './queue/processors/insight-generation.processor';
import { InterventionModule } from './modules/intervention/intervention.module';
import { PanicModule } from './modules/panic/panic.module';
import { ClinicalModule } from './modules/clinical/clinical.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        { ttl: 60_000, limit: config.get('app.env') === 'production' ? 60 : 1000 },
      ],
    }),
    PrismaModule,
    RedisModule,
    BullMQModule,
    AiModule,
    S3Module,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    LivingMindModule,
    MemoryModule,
    HabitModule,
    GoalModule,
    ConversationModule,
    CheckInModule,
    JournalModule,
    NotificationModule,
    AnalyticsModule,
    BillingModule,
    VoiceModule,
    PatternModule,
    InsightModule,
    GrowthReportModule,
    SchedulerModule,
    InterventionModule,
    PanicModule,
    ClinicalModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
    LmmUpdateProcessor,
    EmbeddingProcessor,
    DecayProcessor,
    NotificationProcessor,
    SafetyEscalationProcessor,
    PatternDetectionProcessor,
    InsightGenerationProcessor,
  ],
})
export class AppModule {}
