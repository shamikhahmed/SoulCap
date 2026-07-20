import { Module } from '@nestjs/common';
import { AiOrchestrationService } from './ai-orchestration.service';
import { ResponseStrategyService } from './response-strategy.service';
import { InterventionEngineService } from './intervention-engine.service';
import { LivingMindModule } from '../living-mind/living-mind.module';
import { MemoryModule } from '../memory/memory.module';
import { EmotionalAnalysisModule } from '../emotional-analysis/emotional-analysis.module';
import { SafetyModule } from '../safety/safety.module';

@Module({
  imports: [LivingMindModule, MemoryModule, EmotionalAnalysisModule, SafetyModule],
  providers: [AiOrchestrationService, ResponseStrategyService, InterventionEngineService],
  exports: [AiOrchestrationService, InterventionEngineService],
})
export class AiOrchestrationModule {}
