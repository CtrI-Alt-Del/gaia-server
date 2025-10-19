import { AlertDto } from '@/core/alerting/dtos/alert-dto'
import { PrismaAlert } from '../types'
import { Alert } from '@/core/alerting/domain/entities'

export class PrismaAlertMapper {
  static toEntity(prismaAlert: PrismaAlert): Alert {
    const alertDto: AlertDto = {
      message: prismaAlert.alarm.message,
      level: prismaAlert.alarm.level as 'WARNING' | 'CRITICAL',
      createdAt: prismaAlert.alarm.createdAt,
      parameterName: prismaAlert.alarm.StationParameter.parameter.name,
      parameterUnitOfMeasure: prismaAlert.alarm.StationParameter.parameter.unitOfMeasure,
      parameterStationName: prismaAlert.alarm.StationParameter.station.name,
      measurementValue: prismaAlert.measurement.value,
    }
    return Alert.create(alertDto)
  }
}
