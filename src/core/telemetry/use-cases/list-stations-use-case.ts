import { Id, Logical, PlusInteger, Text } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  isActive: boolean
  name?: string
}
type Response = {
  id?: string
  name: string
  UID: string
  latitude: number
  longitude: number
  address: string
  quantityOfParameters: number
  status?: boolean
  lastMeasurement: Date | null
}

export class ListStationsUseCase
  implements UseCase<Request, CursorPaginationDto<Response>>
{
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<Response>> {
    const paginationDomainObject = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      isActive: Logical.create(params.isActive),
      name: params.name ? Text.create(params.name) : undefined,
    })

    const domainItems = paginationDomainObject.items

    const responseItems = domainItems.map((station) => {
      const dto = station.dto as StationDto
      return {
        id: dto.id,
        name: dto.name,
        UID: dto.UID,
        latitude: dto.latitude,
        longitude: dto.longitude,
        quantityOfParameters: dto.parameters.length,
        status: dto.isActive,
        lastMeasurement: dto.lastReadAt ?? null,
        address: dto.address,
      }
    })

    return {
      items: responseItems,
      pageSize: paginationDomainObject.pageSize.value,
      nextCursor: paginationDomainObject.nextCursor?.value,
      previousCursor: paginationDomainObject.previousCursor?.value,
    }
  }
}
