export type StationListItemDto = {
  id: string
  name: string
  UID: string
  latitude: number
  longitude: number
  quantityOfParameters: number
  status: boolean
  lastMeasurement: Date | null
  address: string
}
