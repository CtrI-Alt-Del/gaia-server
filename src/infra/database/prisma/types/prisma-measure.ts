import { Measure, StationParameter,  } from "@prisma/client";

export type PrismaMeasure = Measure & {
    stationParameter: StationParameter
}