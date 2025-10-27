import { Measurement, Parameter, Station, StationParameter } from '@prisma/client'

export type PrismaMeasure = Measurement & {
  stationParameter: StationParameter & {
    parameter: Parameter
    station: Station
  }
}
