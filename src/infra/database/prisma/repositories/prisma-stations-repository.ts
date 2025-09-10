import { Injectable, Inject } from '@nestjs/common'

import type { StationsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'

@Injectable()
export class PrismaStationsRepository implements StationsRepository {
  constructor(private readonly prisma: Prisma) {}
}
