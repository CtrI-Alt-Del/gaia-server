import { Injectable, Inject } from '@nestjs/common'

import { Prisma } from '../client'
import type { ParametersRepository } from '@/core/global/interfaces'

@Injectable()
export class PrismaParametersRepository implements ParametersRepository {
  constructor(private readonly prisma: Prisma) {}

  async add(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
