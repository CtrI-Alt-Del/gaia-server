import { Id, PlusInteger } from '../structures'

export type CursorPaginationParams = {
  nextCursor?: Id
  previousCursor?: Id
  pageSize: PlusInteger
}
