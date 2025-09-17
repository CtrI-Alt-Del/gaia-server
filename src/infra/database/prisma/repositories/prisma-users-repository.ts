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
  }: UsersListingParams): Promise<CursorPagination<User>> {
    let users: any[]
    let hasPreviousPage = false
    let hasNextPage = false

    const whereClause = status?.isAll.isTrue
      ? undefined
      : { isActive: status?.isActive.isTrue }

    if (nextCursor) {
      users = await this.prisma.user.findMany({
        take: pageSize.value + 1,
        skip: 1,
        cursor: { id: nextCursor.value },
        orderBy: { id: 'asc' },
        where: { ...whereClause, id: { gte: nextCursor.value } },
      })
      const result = this.getNextCursorPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = true
    } else if (previousCursor) {
      users = await this.prisma.user.findMany({
        take: pageSize.value + 1,
        skip: 1,
        cursor: { id: previousCursor.value },
        orderBy: { id: 'desc' },
        where: { ...whereClause, id: { lte: previousCursor.value } },
      })
      const result = this.getPreviousCursorPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = true
      hasPreviousPage = result.hasPreviousPage
    } else {
      users = await this.prisma.user.findMany({
        take: pageSize.value + 1,
        orderBy: { id: 'asc' },
        where: whereClause,
      })
      const result = this.getInitialPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = false
    }

    const newNextCursor = this.getNewNextCursor(users, hasNextPage)
    const newPrevCursor = this.getNewPreviousCursor(users, hasPreviousPage)

    return CursorPagination.create({
      items: users.map(PrismaUserMapper.toEntity),
      pageSize: pageSize.value,
      nextCursor: newNextCursor,
      previousCursor: newPrevCursor,
      hasNextPage,
      hasPreviousPage,
    })
  }

  async replace(user: User): Promise<void> {
    const prismaUser = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.update({ where: { id: user.id.value }, data: prismaUser })
  }
}
