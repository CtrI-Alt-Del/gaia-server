import { Injectable } from '@nestjs/common'

import type { UsersRepository } from '@/core/global/interfaces'
import { UsersListingParams } from '@/core/membership/domain/types'
import { User } from '@/core/membership/domain/entities'
import { CursorPagination, Id, Text } from '@/core/global/domain/structures'

import { PrismaRepository } from './prisma-repository'
import { PrismaUserMapper } from '../mappers'

@Injectable()
export class PrismaUsersRepository extends PrismaRepository implements UsersRepository {
  async add(user: User): Promise<void> {
    const prismaUser = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({ data: prismaUser })
  }

  async addMany(users: User[]): Promise<void> {
    const prismaUsers = users.map(PrismaUserMapper.toPrisma)
    await this.prisma.user.createMany({ data: prismaUsers })
  }

  async findById(id: Id): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.value },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUserMapper.toEntity(prismaUser)
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

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    status,
    name,
  }: UsersListingParams): Promise<CursorPagination<User>> {
    const whereClause = status?.isAll.isTrue
      ? undefined
      : { isActive: status?.isActive.isTrue }

    const where = {
      ...whereClause,
      name: { contains: name?.value, mode: 'insensitive' },
    }

    const query = this.createPaginationQuery(this.prisma.user, where)

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaUserMapper.toEntity)
  }

  async replace(user: User): Promise<void> {
    const prismaUser = PrismaUserMapper.toPrisma(user)
    console.log('prismaUser', prismaUser)
    await this.prisma.user.update({ where: { id: user.id.value }, data: prismaUser })
  }
}
