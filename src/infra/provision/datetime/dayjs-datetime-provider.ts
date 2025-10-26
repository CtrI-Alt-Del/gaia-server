import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { Injectable } from '@nestjs/common'

import { DatetimeProvider } from '@/core/global/interfaces'

dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class DayjsDatetimeProvider implements DatetimeProvider {
  getStartOf(date: Date): Date {
    return dayjs(date).startOf('day').subtract(3, 'hours').add(1, 'day').toDate()
  }

  getEndOf(date: Date): Date {
    return dayjs(date).endOf('day').subtract(3, 'hours').add(1, 'day').toDate()
  }
}
