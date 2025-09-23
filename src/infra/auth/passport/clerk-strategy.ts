import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { Request } from 'express'
import { ClerkClient, User, verifyToken } from '@clerk/backend'

import { EnvProvider } from '@/infra/provision/env/env-provider'
import { UnauthorizedError } from '@/core/auth'

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject('CLERK')
    private readonly clerk: ClerkClient,
    private readonly envProvider: EnvProvider,
  ) {
    super()
  }

  async validate(req: Request): Promise<User> {
    const token = req.headers.authorization?.split(' ').pop()


    if (!token) {
      throw new UnauthorizedError('Nenhum token fornecido')
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.envProvider.get('CLERK_SECRET_KEY'),
      })

      const user = await this.clerk.users.getUser(tokenPayload.sub)

      return user
    } catch (error) {
      console.error(error)
      throw new UnauthorizedError('Token inválido')
    }
  }
}
