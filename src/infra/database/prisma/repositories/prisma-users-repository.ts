import { Injectable } from '@nestjs/common'

import type { UsersRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { User } from '@/core/membership/domain/entities'
import { PrismaUserMapper } from '../mappers'
import { Text } from '@/core/global/domain/structures'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: Prisma) {}

  async add(user: User): Promise<void> {
    const prismaUser = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({ data: prismaUser })
  }

  async findByEmail(email: Text): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.value },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUserMapper.toEntity(prismaUser)
  }
}
