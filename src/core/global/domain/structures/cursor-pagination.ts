import { CursorPaginationDto } from './dtos/cursor-pagination-dto'
import { Id } from './id'
import { Logical } from './logical'
import { PlusInteger } from './plus-integer'

export class CursorPagination<Item> {
  constructor(
    readonly items: Item[],
    readonly pageSize: PlusInteger,
    readonly nextCursor: Id | null,
    readonly previousCursor: Id | null,
    readonly hasNextPage: Logical,
    readonly hasPreviousPage: Logical,
  ) {}

  static create<ItemDto>(dto: CursorPaginationDto<ItemDto>): CursorPagination<ItemDto> {
    return new CursorPagination(
      dto.items,
      PlusInteger.create(dto.pageSize),
      dto.nextCursor ? Id.create(dto.nextCursor) : null,
      dto.previousCursor ? Id.create(dto.previousCursor) : null,
      dto.hasNextPage ? Logical.create(dto.hasNextPage) : Logical.createAsFalse(),
      dto.hasPreviousPage ? Logical.create(dto.hasPreviousPage) : Logical.createAsFalse(),
    )
  }

  map<NewItem>(mapper: (item: Item) => NewItem): CursorPagination<NewItem> {
    return new CursorPagination<NewItem>(
      this.items.map(mapper),
      this.pageSize,
      this.nextCursor,
      this.previousCursor,
      this.hasNextPage,
      this.hasPreviousPage,
    )
  }

  get dto(): CursorPaginationDto<Item> {
    return {
      items: this.items,
      pageSize: this.pageSize.value,
      nextCursor: this.nextCursor?.value ?? null,
      previousCursor: this.previousCursor?.value ?? null,
      hasNextPage: this.hasNextPage?.value ?? false,
      hasPreviousPage: this.hasPreviousPage?.value ?? false,
    }
  }
}
