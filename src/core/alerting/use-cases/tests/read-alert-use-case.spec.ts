import { beforeEach, describe, expect, it } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import { ReadAlertUseCase } from '../read-alert-use-case'
import { AlertsRepository } from '../../interfaces/alerts-repository'
import { AlertFaker } from '../../domain/entities/fakers/alerts-faker'
import { AlertNotFoundError } from '../../domain/errors/alert-not-found-error'
import { Id } from '@/core/global/domain/structures'

describe('Read Alert Use Case', () => {
  let repository: MockProxy<AlertsRepository>
  let useCase: ReadAlertUseCase

  beforeEach(() => {
    repository = mock<AlertsRepository>()
    useCase = new ReadAlertUseCase(repository)
  })

  it('should mark the alert as read and replace it in the repository', async () => {
    const alert = AlertFaker.fake({ isRead: false })
    repository.findById.mockResolvedValue(alert)

    const result = await useCase.execute(alert.id.value)

    const [idParam] = repository.findById.mock.calls[0]
    expect(idParam).toBeInstanceOf(Id)
    expect(idParam.value).toBe(alert.id.value)

    expect(alert.isRead.isTrue).toBe(true)
    expect(repository.replace).toHaveBeenCalledWith(alert)
    expect(result).toEqual(alert.dto)
  })

  it('should throw AlertNotFoundError when the alert does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute('non-existing-id')).rejects.toBeInstanceOf(
      AlertNotFoundError,
    )
    expect(repository.replace).not.toHaveBeenCalled()
  })
})
