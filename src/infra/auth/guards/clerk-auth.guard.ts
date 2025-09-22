import { type ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ClerkAuthGuard extends AuthGuard('clerk') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>('IS_PUBLIC_ROUTE', [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublicRoute) {
      return true
    }

    return super.canActivate(context)
  }
}
