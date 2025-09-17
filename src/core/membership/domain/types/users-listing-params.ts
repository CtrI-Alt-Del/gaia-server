import { Text } from '@/core/global/domain/structures'
import { CursorPaginationParams } from '@/core/global/domain/types'
import { ListingParams } from '@/core/global/domain/types/listing-params'

export type UsersListingParams = ListingParams & CursorPaginationParams & { name?: Text }
