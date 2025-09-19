import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach } from 'vitest'

import { Id, Logical, PlusInteger, Text } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { CursorPagination } from '@/core/global/domain/structures/cursor-pagination'
import { ListStationsUseCase } from '@/core/telemetry/use-cases/list-stations-use-case'

describe('ListStationsUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: ListStationsUseCase

  const mockStationsPagination = CursorPagination.create({
    items: [
      {
        id: '123',
        name: 'Station 1',
        code: 'ST-001',
        latitude: -23.1791,
        longitude: -45.8872,
        address: '123 Main St',
        _count: {
          stationParameter: 5,
        },
        createdAt: new Date(),
        isActive: true,
        updatedAt: new Date(),
      },
    ],
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
      isActive: false,
    })

    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(15),
      isActive: Logical.create(false),
      name: undefined,
      nextCursor: undefined,
      previousCursor: undefined,
    })
  })

  it('should call the repository with pagination and all optional parameters', async () => {
    const request = {
      pageSize: 20,
      isActive: true,
      name: 'Main Station',
      nextCursor: 'next-cursor-id',
      previousCursor: 'prev-cursor-id',
    }

    await useCase.execute(request)

    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(request.pageSize),
      isActive: Logical.create(request.isActive),
      name: Text.create(request.name),
      nextCursor: Id.create(request.nextCursor),
      previousCursor: Id.create(request.previousCursor),
    })
  })

  it('should map the repository result to a paginated DTO', async () => {
    const result = await useCase.execute({
      pageSize: 10,
      isActive: true,
    })

    const expectedResponse = {
      items: mockStationsPagination.items.map((station) => ({
        id: station.id,
        name: station.name,
        UID: station.code,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
        quantityOfParameters: station._count.stationParameter,
        status: station.isActive,
        lastMeasurement: station.updatedAt ?? null,
      })),
      pageSize: mockStationsPagination.pageSize.value,
      nextCursor: mockStationsPagination.nextCursor?.value,
      previousCursor: mockStationsPagination.previousCursor?.value,
    }

    expect(result).toEqual(expectedResponse)
  })
})
