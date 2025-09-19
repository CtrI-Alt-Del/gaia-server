import type Prisma from '@prisma/client'

import { User } from '@/core/membership/domain/entities'
import { PrismaUser } from '../types'

export class PrismaUserMapper {
  static toEntity(prismaUser: Prisma.User) {
    return User.create({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role === 'OWNER' ? 'owner' : 'member',
      isActive: prismaUser.isActive ?? false,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      role: user.role.value === 'owner' ? 'OWNER' : 'MEMBER',
      isActive: user.isActive.value,
      createdAt: user.createdAt.value,
      updatedAt: user.updatedAt?.value,
    }
  }
}
