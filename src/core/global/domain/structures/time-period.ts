import { AppError } from '../errors'

export class TimePeriod {
  private constructor(readonly value: 'YEARLY' | 'WEEKLY') {}

  static create(value: string): TimePeriod {
    if (value !== 'YEARLY' && value !== 'WEEKLY') {
      throw new AppError('Invalid time period')
    }
    return new TimePeriod(value)
  }
}
