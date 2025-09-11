import { EnvProvider } from '@/infra/provision/env/env-provider'
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

@Injectable()
export class Prisma extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(envProvider: EnvProvider) {
    super({
      log: envProvider.get('MODE') === 'dev' ? ['warn', 'error'] : [],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
