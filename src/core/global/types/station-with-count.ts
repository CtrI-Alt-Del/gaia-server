export type StationWithCount = {
  id: string
  uid: string
  name: string
  latitude: number
  longitude: number
  address: string
  isActive: boolean
  lastReadAt: Date | null
  createdAt: Date
  updatedAt: Date
  quantityOfParameters: number
}
