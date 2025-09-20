export type StationWithCount = {
  id: string
  uid: string
  name: string
  latitude: number
  longitude: number
  address: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    stationParameter: number
  }
}
