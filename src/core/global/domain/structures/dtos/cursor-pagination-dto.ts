export type CursorPaginationDto<ItemDto> = {
  items: ItemDto[]
  pageSize: number
  nextCursor?: string | null
  previousCursor?: string | null
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}
