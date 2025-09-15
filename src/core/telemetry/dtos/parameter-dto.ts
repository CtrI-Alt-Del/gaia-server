export type ParameterDto = {
  id?: string
  name: string
  unitOfMeasure: string
  numberOfDecimalPlaces: number
  factor: number
  offset: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
