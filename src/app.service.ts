import { Injectable } from '@nestjs/common';
import { RedisService } from './common/db/redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}
  getHello(): string {
    this.redisService.setCache('test', 'test');
    return 'Hello World!';
  }
}
