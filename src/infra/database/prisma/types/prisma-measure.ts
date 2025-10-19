import { Measure, Parameter, Station, StationParameter } from '@prisma/client'

export type PrismaMeasure = Measure & {
  stationParameter: StationParameter & {
    parameter: Parameter
    station: Station
  }
}
