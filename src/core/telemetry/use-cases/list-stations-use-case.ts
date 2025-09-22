import { Id, PlusInteger, Status, Text } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import { StationListItemDto } from '@/core/telemetry/domain/dtos/station-list-item-dto'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
  name?: string
}


export class ListStationsUseCase
  implements UseCase<Request, CursorPaginationDto<StationListItemDto>>
{
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<StationListItemDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      status: Status.create(params.status),
      name: params.name ? Text.create(params.name) : undefined,
    })

    const responseItems = pagination.items.map(
      (station): StationListItemDto => ({
        id: station.id,
        name: station.name,
        uid: station.uid,
        latitude: station.latitude,
        longitude: station.longitude,
        quantityOfParameters: station._count.stationParameter,
        status: station.isActive,
        lastMeasurement: station.updatedAt ?? null,
        address: station.address,
      }),
    )

    return {
      items: responseItems,
      pageSize: pagination.pageSize.value,
      nextCursor: pagination.nextCursor?.value ?? null,
      previousCursor: pagination.previousCursor?.value ?? null,
      hasNextPage: pagination.hasNextPage.value,
      hasPreviousPage: pagination.hasPreviousPage.value,
    }
  }
}
