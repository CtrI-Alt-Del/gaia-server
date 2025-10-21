import { Alert, Alarm, Parameter, StationParameter, Station } from '@prisma/client'

export type PrismaAlert = Alert & {
  alarm: Alarm
  stationParameter: StationParameter & {
    parameter: Parameter
    station: Station
  }
}
