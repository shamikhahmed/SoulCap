import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationRepository } from './conversation.repository';
import { LivingMindModule } from '../living-mind/living-mind.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [LivingMindModule, MemoryModule],
  providers: [ConversationService, ConversationRepository],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
