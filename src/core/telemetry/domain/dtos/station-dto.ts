export type StationDto = {
  id?: string
  name: string
  uid: string
  latitude: number
  address: string
  longitude: number
  quantityOfParameters?: number
  lastReadAt?: Date | null
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
