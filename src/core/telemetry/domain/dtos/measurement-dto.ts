export type MeasurementDto = {
  id?: string
  stationId: string
  parameterId: string
  stationName: string
  parameterName: string
  unitOfMeasure: string
  value: number
  createdAt: Date
}
