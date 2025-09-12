import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'

@Injectable()
export class PrismaAlarmsRepository implements AlarmsRepository {
  constructor(private readonly prisma: Prisma) {}
}
