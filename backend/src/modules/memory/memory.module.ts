import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { MemoryRepository } from './memory.repository';
import { MemoryController } from './memory.controller';
import { BeliefNodesService } from './belief-nodes.service';

@Module({
  providers: [MemoryService, MemoryRepository, BeliefNodesService],
  controllers: [MemoryController],
  exports: [MemoryService, BeliefNodesService],
})
export class MemoryModule {}
