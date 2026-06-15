import { Module } from '@nestjs/common';
import { LivingMindService } from './living-mind.service';
import { LivingMindRepository } from './living-mind.repository';
import { LivingMindController } from './living-mind.controller';

@Module({
  providers: [LivingMindService, LivingMindRepository],
  controllers: [LivingMindController],
  exports: [LivingMindService],
})
export class LivingMindModule {}
