import { Injectable } from '@nestjs/common'
import type { PrismaParameter } from '../types'
import { Parameter } from '@/core/telemetry/entities/parameter'

@Injectable()
export class PrismaParameterMapper {
  static toEntity(prismaParameter: PrismaParameter) {}

  static toPrisma(parameter: Parameter) {}
}
