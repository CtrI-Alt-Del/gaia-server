import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach } from 'vitest'

import { Id, PlusInteger, Status, Text } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { CursorPagination } from '@/core/global/domain/structures/cursor-pagination'
import { ListStationsUseCase } from '@/core/telemetry/use-cases/list-stations-use-case'
import { StationsFaker } from '../../domain/entities/fakers/station-faker'

describe('ListStationsUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: ListStationsUseCase

  const mockStationsPagination = CursorPagination.create({
    items: StationsFaker.fakeMany(10),
    pageSize: 10,
    nextCursor: Id.create('next-id').value,
    previousCursor: Id.create('prev-id').value,
  })

  beforeEach(() => {
    repository = mock<StationsRepository>()
    repository.findMany.mockResolvedValue(mockStationsPagination)
    useCase = new ListStationsUseCase(repository)
  })

  it('should call the repository with pagination but without optional parameters', async () => {
    await useCase.execute({
      pageSize: 15,
      status: 'all',
    })

    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(15),
      status: Status.create('all'),
      name: undefined,
      nextCursor: undefined,
      previousCursor: undefined,
    })
  })

  it('should call the repository with pagination and all optional parameters', async () => {
    const request = {
      pageSize: 20,
      status: 'all',
      name: 'Main Station',
      nextCursor: 'next-cursor-id',
      previousCursor: 'prev-cursor-id',
    }

    await useCase.execute(request)

    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(request.pageSize),
      status: Status.create(request.status),
      name: Text.create(request.name),
      nextCursor: Id.create(request.nextCursor),
      previousCursor: Id.create(request.previousCursor),
    })
  })

  it('should map the repository result to a paginated DTO', async () => {
    const result = await useCase.execute({
      pageSize: 10,
      status: 'all',
    })

    const expectedResponse = {
      items: mockStationsPagination.items.map((station) => ({
        id: station.id.value,
        name: station.name.value,
        uid: station.uid.value.value,
        latitude: station.coordinate.latitude.value,
        longitude: station.coordinate.longitude.value,
        address: station.address.value,
        quantityOfParameters: station.quantityOfParameters.value,
        isActive: station.isActive.value,
        lastReadAt: station.lastReadAt?.value ?? null,
      })),
      pageSize: mockStationsPagination.pageSize.value,
      nextCursor: mockStationsPagination.nextCursor?.value ?? null,
      previousCursor: mockStationsPagination.previousCursor?.value ?? null,
      hasNextPage: mockStationsPagination.hasNextPage.value,
      hasPreviousPage: mockStationsPagination.hasPreviousPage.value,
    }

    expect(result).toEqual(expectedResponse)
  })
})
