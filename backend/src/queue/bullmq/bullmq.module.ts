import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAMES } from './queue.constants';

const queues = Object.values(QUEUE_NAMES).map((name) =>
  BullModule.registerQueue({ name }),
);

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          password: config.get('redis.password'),
          tls: config.get('redis.tls') ? {} : undefined,
        },
        defaultJobOptions: config.get('queues.defaultJobOptions'),
      }),
      inject: [ConfigService],
    }),
    ...queues,
  ],
  exports: [BullModule],
})
export class BullMQModule {}
