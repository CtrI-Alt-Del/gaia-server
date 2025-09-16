import { Injectable } from '@nestjs/common'

import type { StationsRepository } from '@/core/global/interfaces'

import { PrismaRepository } from './prisma-repository'

@Injectable()
export class PrismaStationsRepository
  extends PrismaRepository
  implements StationsRepository {}
