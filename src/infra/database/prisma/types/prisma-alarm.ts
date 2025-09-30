import { Alarm, Parameter } from '@prisma/client'

export type PrismaAlarm = Alarm & {
  parameter: Parameter
}
