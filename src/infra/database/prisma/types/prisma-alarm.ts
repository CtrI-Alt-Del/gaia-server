import type { Alarm } from '@prisma/client'
import { PrismaParameter } from './prisma-parameter'

export type PrismaAlarm = Alarm & {parameter?: PrismaParameter}
