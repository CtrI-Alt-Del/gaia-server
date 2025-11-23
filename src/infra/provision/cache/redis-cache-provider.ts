import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

import { CacheProvider } from '@/core/global/interfaces'
import { EnvProvider } from '../env/env-provider'

@Injectable()
export class RedisCacheProvider implements CacheProvider {
  private readonly redis: Redis

  constructor(envProvider: EnvProvider) {
    this.redis = new Redis({
      host: envProvider.get('REDIS_HOST'),
      port: envProvider.get('REDIS_PORT'),
      password: envProvider.get('REDIS_PASSWORD'),
      tls: {
        rejectUnauthorized: false,
      },
    })
    this.redis.on('error', (error) => {
      console.error('Redis error:', error)
    })
    this.redis.on('ready', () => {
      console.log('🍱 Redis connected')
    })
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.redis.set(key, JSON.stringify(value))
  }

  async get<Data = string>(key: string): Promise<Data | null> {
    const data = await this.redis.get(key)
    return data ? (JSON.parse(data) as Data) : null
  }

  async clear(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
