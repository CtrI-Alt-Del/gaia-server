import { mock, MockProxy } from 'vitest-mock-extended'

import { CursorPagination } from '@/core/global/domain/structures/cursor-pagination'
import { ListAlertsUseCase } from '../list-alerts-use-case'
import { AlertFaker } from '../../domain/entities/fakers/alerts-faker'
import { Id, PlusInteger, Timestamp } from '@/core/global/domain/structures'
import { AlertsRepository } from '../../interfaces/alerts-repository'

describe('ListAlertsUseCase', () => {
  let repository: MockProxy<AlertsRepository>
  let useCase: ListAlertsUseCase

  beforeEach(() => {
    repository = mock<AlertsRepository>()
    useCase = new ListAlertsUseCase(repository)
  })

  it('should return a paginated list of alerts', async () => {
    const alerts = AlertFaker.fakeMany(3)
    const pagination = CursorPagination.create({
      items: alerts,
      nextCursor: Id.create().value,
      previousCursor: Id.create().value,
      pageSize: 3,
    })
    repository.findMany.mockResolvedValue(pagination)

    const result = await useCase.execute({ pageSize: 3 })

    expect(result.items).toEqual(alerts.map((alert) => alert.dto))
    expect(result.nextCursor).toEqual(pagination.nextCursor?.value)
    expect(result.previousCursor).toEqual(pagination.previousCursor?.value)
    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(3),
      nextCursor: undefined,
      previousCursor: undefined,
      level: undefined,
      date: undefined,
    })
  })

  it('should return an empty list if no alerts are found', async () => {
    const pagination = CursorPagination.create({
      items: [],
      nextCursor: undefined,
      previousCursor: undefined,
      pageSize: 10,
    })
    repository.findMany.mockResolvedValue(pagination)

    const result = await useCase.execute({ pageSize: 10 })

    expect(result.items).toEqual([])
    expect(result.nextCursor).toBeNull()
    expect(result.previousCursor).toBeNull()
  })

  it('should handle nextCursor and previousCursor for pagination', async () => {
    const alerts = AlertFaker.fakeMany(2)
    const nextCursorId = Id.create()
    const previousCursorId = Id.create()
    const pagination = CursorPagination.create({
      items: alerts,
      nextCursor: nextCursorId.value,
      previousCursor: previousCursorId.value,
      pageSize: 2,
    })
    repository.findMany.mockResolvedValue(pagination)

    const result = await useCase.execute({
      pageSize: 2,
      nextCursor: nextCursorId.value,
      previousCursor: previousCursorId.value,
    })

    expect(result.items).toEqual(alerts.map((alert) => alert.dto))
    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(2),
      nextCursor: nextCursorId,
      previousCursor: previousCursorId,
      level: undefined,
      date: undefined,
    })
  })

  it('should filter alerts by level', async () => {
    const alerts = AlertFaker.fakeMany(1, { level: 'CRITICAL' })
    const pagination = CursorPagination.create({
      items: alerts,
      nextCursor: undefined,
      previousCursor: undefined,
      pageSize: 1,
    })
    repository.findMany.mockResolvedValue(pagination)

    const result = await useCase.execute({ pageSize: 1, level: 'CRITICAL' })

    expect(result.items).toEqual(alerts.map((alert) => alert.dto))
    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(1),
      nextCursor: undefined,
      previousCursor: undefined,
      level: alerts[0].level,
      date: undefined,
    })
  })

  it('should filter alerts by date', async () => {
    const alerts = AlertFaker.fakeMany(1)
    const date = new Date().toISOString()
    const pagination = CursorPagination.create({
      items: alerts,
      nextCursor: undefined,
      previousCursor: undefined,
      pageSize: 1,
    })
    repository.findMany.mockResolvedValue(pagination)

    const result = await useCase.execute({ pageSize: 1, date })

    expect(result.items).toEqual(alerts.map((alert) => alert.dto))
    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(1),
      nextCursor: undefined,
      previousCursor: undefined,
      level: undefined,
      date: Timestamp.createFromString(date),
    })
  })
})
