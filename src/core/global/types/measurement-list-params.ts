import { Text, Timestamp } from '../domain/structures'
import { CursorPaginationParams, ListingParams } from '../domain/types'

export type MeasurementListParams = ListingParams &
  CursorPaginationParams & {
    stationId?: Text
    parameterId?: Text
    date?: Timestamp
  }
