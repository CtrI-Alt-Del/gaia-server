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
    name,
    nextCursor,
    previousCursor,
    pageSize,
    isActive,
  }: UsersListingParams): Promise<CursorPagination<User>> {
    let users: any[]
    let hasPreviousPage = false
    let hasNextPage = false

    if (nextCursor) {
      users = await this.prisma.user.findMany({
        ...this.getNextCursorPaginationParams(nextCursor, pageSize),
        where: { isActive: isActive?.isTrue, name: { contains: name?.value } },
      })
      const result = this.getNextCursorPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else if (previousCursor) {
      users = await this.prisma.user.findMany({
        ...this.getPreviousCursorPaginationParams(previousCursor, pageSize),
        where: { isActive: isActive?.isTrue, name: { contains: name?.value } },
      })
      const result = this.getPreviousCursorPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else {
      users = await this.prisma.user.findMany({
        ...this.getInitialPaginationParams(pageSize),
        where: { isActive: isActive?.isTrue, name: { contains: name?.value } },
      })
      const result = this.getInitialPaginationResult(users, pageSize)
      users = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    }

    const newNextCursor = this.getNewNextCursor(users, hasNextPage)
    const newPrevCursor = this.getNewPreviousCursor(users)

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
