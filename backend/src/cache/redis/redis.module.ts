import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          password: config.get('redis.password'),
          tls: config.get('redis.tls') ? {} : undefined,
          keyPrefix: config.get('redis.keyPrefix'),
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          lazyConnect: false,
        }),
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
