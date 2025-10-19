import { Text, Timestamp } from '../domain/structures'
import { CursorPaginationParams } from '../domain/types'

export type AlertListingParams = CursorPaginationParams & {
  level?: Text
  date?: Timestamp
}
