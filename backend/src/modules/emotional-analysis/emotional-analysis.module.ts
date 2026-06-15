import { Module } from '@nestjs/common';
import { EmotionalAnalysisService } from './emotional-analysis.service';

@Module({
  providers: [EmotionalAnalysisService],
  exports: [EmotionalAnalysisService],
})
export class EmotionalAnalysisModule {}
