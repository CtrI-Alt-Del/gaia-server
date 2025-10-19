import {
  Alert,
  Alarm,
  Parameter,
  StationParameter,
  Station,
  Measure,
} from '@prisma/client'

export type PrismaAlert = Alert & {
  alarm: Alarm & {
    StationParameter: StationParameter & {
      station: Station
      parameter: Parameter
    }
  }
  measurement: Measure
}
