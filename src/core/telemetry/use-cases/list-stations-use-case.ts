import { Id, Logical, PlusInteger, Text } from '@/core/global/domain/structures'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'

import { StationWithCount } from '@/core/global/types'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  isActive: boolean
  name?: string
}


type Response = CursorPaginationDto<{
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


export class ListStationsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<Response> {
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
      return {
        id: station.id,
        name: station.name,
        UID: station.code, 
        latitude: station.latitude,
        longitude: station.longitude,
        quantityOfParameters: station._count.stationParameter,
        status: station.isActive,
        lastMeasurement: station.updatedAt ?? null, 
        address: station.address,
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
