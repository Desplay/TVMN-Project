import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
  port: Number(process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379),
  password: process.env.REDIS_PASSWORD
    ? process.env.REDIS_PASSWORD
    : undefined,
};

@Injectable()
export class RedisService {
  private readonly client: Redis;
  constructor() {
    this.client = new Redis({
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port,
      password: REDIS_CONFIG.password,
    });
  }
  async setCache(
    key: string,
    value: string,
    expirationInSeconds?: number,
  ): Promise<boolean> {
    if ((await this.client.set(key, value)) !== 'OK') {
      return false;
    }
    let status = 0;
    if (expirationInSeconds) {
      status = await this.client.expire(key, expirationInSeconds);
    } else {
      status = await this.client.expire(key, 60 * 15);
    }
    return status === 1;
  }

  async getCache(key: string): Promise<string | boolean> {
    const data = await this.client.get(key);
    if (!data) {
      return false;
    }
  }
  async deleteCache(key: string): Promise<boolean> {
    const status = await this.client.del(key);
    return status === 1;
  }
}
