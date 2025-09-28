import { Id, PlusInteger, Status, Text } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import { StationDto } from '../domain/dtos/station-dto'
import { StationDto } from '../domain/dtos/station-dto'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
  name?: string
}

type Response = CursorPaginationDto<StationDto>
type Response = CursorPaginationDto<StationDto>

export class ListStationsUseCase implements UseCase<Request, Response> {
export class ListStationsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<Response> {
  async execute(params: Request): Promise<Response> {
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
      (station): StationDto => ({
        id: station.id.value,
        name: station.name.value,
        uid: station.uid.value.value,
        latitude: station.coordinate.latitude.value,
        longitude: station.coordinate.longitude.value,
        quantityOfParameters: station.quantityOfParameters.value,
        isActive: station.isActive.value,
        lastReadAt: station.lastReadAt?.value ?? null,
        address: station.address.value,
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
