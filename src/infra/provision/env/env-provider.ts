import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import type { Env } from './env'

@Injectable()
export class EnvProvider {
  constructor(private configService: ConfigService<Env, true>) {}
  get<Key extends keyof Env>(key: Key) {
    return this.configService.get<Env[Key]>(key, { infer: true })
  }
}
