import { Text } from '@/core/global/domain/structures'
import { CursorPaginationParams, ListingParams } from '@/core/global/domain/types'

export type StationsListingParams = ListingParams &
  CursorPaginationParams & {
    name?: Text
  }
