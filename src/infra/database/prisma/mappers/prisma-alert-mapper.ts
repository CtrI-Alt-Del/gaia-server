import { PrismaAlert } from '../types'
import { Alert } from '@/core/alerting/domain/entities'

export class PrismaAlertMapper {
  static toEntity(prismaAlert: PrismaAlert): Alert {
    return Alert.create({
      id: prismaAlert.id,
      message: prismaAlert.alarm.message,
      level: prismaAlert.alarm.level as 'WARNING' | 'CRITICAL',
      createdAt: prismaAlert.createdAt,
      parameterName: prismaAlert.stationParameter.parameter.name,
      parameterUnitOfMeasure: prismaAlert.stationParameter.parameter.unitOfMeasure,
      parameterStationName: prismaAlert.stationParameter.station.name,
      measurementValue: prismaAlert.measurementValue,
      isRead: prismaAlert.isRead,
    })
  }
}
