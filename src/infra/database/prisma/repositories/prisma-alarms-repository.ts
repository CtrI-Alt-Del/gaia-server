import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { Alarm } from '@/core/alerting/domain/entities/alarm'

@Injectable()
export class PrismaAlarmsRepository implements AlarmsRepository {
  constructor(private readonly prisma: Prisma) {}
  add(alarm: Alarm): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
