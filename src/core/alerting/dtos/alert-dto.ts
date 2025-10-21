export type AlertDto = {
  message: string
  measurementValue: number
  parameterName: string
  parameterUnitOfMeasure: string
  parameterStationName: string
  level: string
  isRead: boolean
  createdAt: Date
}
