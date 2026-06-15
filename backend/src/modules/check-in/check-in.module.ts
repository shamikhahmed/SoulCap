import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { LivingMindModule } from '../living-mind/living-mind.module';

@Module({
  imports: [LivingMindModule],
  providers: [CheckInService],
  controllers: [CheckInController],
  exports: [CheckInService],
})
export class CheckInModule {}
