import { Integer } from '@/core/global/domain/structures/integer'

export class Coordinate {
  readonly latitude: Integer
  readonly longitude: Integer
  private constructor(latitude: number, longitude: number) {
    this.latitude = Integer.create(latitude)
    this.longitude = Integer.create(longitude)
  }
  static create(latitude: number, longitude: number): Coordinate {
    return new Coordinate(latitude, longitude)
  }
  update(latitude: number, longitude: number): Coordinate {
    return new Coordinate(latitude, longitude)
  }
  equalsTo(other: Coordinate): boolean {
    return (
      this.latitude.value === other.latitude.value &&
      this.longitude.value === other.longitude.value
    )
  }
  notEqualsTo(other: Coordinate): boolean {
    return !this.equalsTo(other)
  }
  static createFromText(longitude: string, latitude: string): Coordinate {
    return new Coordinate(parseInt(latitude), parseInt(longitude))
  }
}
