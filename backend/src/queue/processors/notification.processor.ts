import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../bullmq/queue.constants';
import { SendPushJobData } from '../bullmq/queue.contracts';
import { NotificationService } from '../../modules/notification/notification.service';

@Processor(QUEUE_NAMES.NOTIFICATION_DISPATCH)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notifications: NotificationService) {
    super();
  }

  async process(job: Job<SendPushJobData>) {
    await this.notifications.sendPush(job.data.userId, {
      title: job.data.title,
      body: job.data.body,
      data: job.data.data,
    });
    this.logger.debug(`Push sent to user ${job.data.userId}`);
  }
}
