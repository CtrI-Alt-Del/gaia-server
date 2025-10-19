import { AlertDto } from '@/core/alerting/dtos/alert-dto'
import { PrismaAlert } from '../types'
import { Alert } from '@/core/alerting/domain/entities'

export class PrismaAlertMapper {
  static toEntity(prismaAlert: PrismaAlert): Alert {
    const alertDto: AlertDto = {
      message: prismaAlert.alarm.message,
      level: prismaAlert.alarm.level as 'WARNING' | 'CRITICAL',
      createdAt: prismaAlert.alarm.createdAt,
      parameterName: prismaAlert.stationParameter.parameter.name,
      parameterUnitOfMeasure: prismaAlert.stationParameter.parameter.unitOfMeasure,
      parameterStationName: prismaAlert.stationParameter.station.name,
      measurementValue: prismaAlert.measurementValue,
    }
    return Alert.create(alertDto)
  }
}
