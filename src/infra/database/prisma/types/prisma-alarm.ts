import { Alarm, Parameter, Station, StationParameter } from '@prisma/client'

export type PrismaAlarm = Alarm & {
  StationParameter: StationParameter & {
    station: Station
    parameter: Parameter
  }
}
