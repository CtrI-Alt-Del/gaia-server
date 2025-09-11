import { Injectable, Inject } from '@nestjs/common'

import type { UsersRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: Prisma) {}
}
