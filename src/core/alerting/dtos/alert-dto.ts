export type AlertDto = {
  id?: string
  message: string
  measurementValue: number
  parameterName: string
  parameterUnitOfMeasure: string
  parameterStationName: string
  level: string
  isRead: boolean
  createdAt: Date
}
