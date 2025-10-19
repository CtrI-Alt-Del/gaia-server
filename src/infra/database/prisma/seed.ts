import { $Enums, PrismaClient } from '@prisma/client'

import { UsersFaker } from '@/core/membership/domain/entities/fakers'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
import { PrismaUserMapper, PrismaParameterMapper } from './mappers'
import { AlarmsFaker } from '@/core/alerting/domain/entities/fakers/alarms-faker'
import { MeasurementFaker } from '@/core/telemetry/domain/entities/fakers/measurement-faker'

export async function seed() {
  const prisma = new PrismaClient({
    log: process.env.LOG_LEVEL === 'debug' ? ['warn', 'error', 'info'] : [],
  })

  try {
    console.log('🌱 Iniciando seed do banco de dados...')

    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

    console.log('🧹 Limpando dados existentes...')

    await prisma.measure.deleteMany()
    console.log('✅ Measures removidos')

    await prisma.stationParameter.deleteMany()
    console.log('✅ StationParameters removidos')

    await prisma.station.deleteMany()
    console.log('✅ Stations removidas')

    await prisma.alarm.deleteMany()
    console.log('✅ Alarms removidos')

    await prisma.parameter.deleteMany()
    console.log('✅ Parameters removidos')

    await prisma.user.deleteMany()
    console.log('✅ Users removidos')

    await prisma.alert.deleteMany()
    console.log('✅ Alerts removidos')

    console.log('✅ Limpeza concluída!')

    const ownerUser = UsersFaker.fake({
      id: 'cmfyf7bbs0000civ25oavg5er',
      name: 'Diogo Braquinho',
      email: 'gaia.ctrlaltdel@gmail.com',
      role: 'owner',
    })
    const membersUsers = UsersFaker.fakeMany(100, { role: 'member' })
    const users = [ownerUser, ...membersUsers]
    const prismaUsers = users.map(PrismaUserMapper.toPrisma)

    await prisma.user.createMany({
      data: prismaUsers,
      skipDuplicates: true,
    })

    console.log(`✅ ${users.length} usuários adicionados com sucesso!`)

    const parameters = ParameterFaker.fakeMany(50)
    const prismaParameters = parameters.map(PrismaParameterMapper.toPrisma)

    await prisma.parameter.createMany({
      data: prismaParameters,
      skipDuplicates: true,
    })

    console.log(`✅ ${parameters.length} parâmetros adicionados com sucesso!`)

    const stations = StationsFaker.fakeMany(1000)

    const stationsParameter: {
      id: string
      stationId: string
      parameterId: string
    }[] = []

    for (const station of stations) {
      const stationData = {
        id: station.id.value,
        name: station.name.value,
        uid: station.uid.value.value,
        address: station.address.value,
        latitude: station.coordinate.latitude.value,
        longitude: station.coordinate.longitude.value,
        isActive: station.isActive.value,
        createdAt: station.createdAt.value,
        updatedAt: station.updatedAt?.value,
      }

      await prisma.station.create({
        data: stationData,
      })

      const randomParameters = parameters.slice(0, Math.floor(Math.random() * 5) + 1)

      for (const parameter of randomParameters) {
        const stationParameter = await prisma.stationParameter.create({
          data: {
            stationId: station.id.value,
            parameterId: parameter.id.value,
          },
        })

        stationsParameter.push(stationParameter)
      }
    }

    console.log(`✅ ${stations.length} stations adicionadas com sucesso!`)

    const measurements = MeasurementFaker.fakeMany(100)

    for (const measurement of measurements) {
      const randomStationParameter =
        stationsParameter[Math.floor(Math.random() * stationsParameter.length)]

      const measurementData = {
        id: measurement.id.value,
        value: measurement.value.value,
        unitOfMeasure: parameters.find(
          (p) => p.id.value === randomStationParameter.parameterId,
        )?.unitOfMeasure.value as string,
        createdAt: measurement.createdAt.value,
        stationParameter: {
          connect: {
            id: randomStationParameter.id,
          },
        },
      }

      await prisma.measure.create({
        data: measurementData,
      })
    }

    console.log(`✅ ${measurements.length} measurements adicionadas com sucesso!`)

    const alarms = AlarmsFaker.fakeMany(100)

    for (const alarm of alarms) {
      await prisma.alarm.create({
        data: {
          message: alarm.message.value,
          value: alarm.rule.threshold.value,
          operation: alarm.rule.operation.toString() as $Enums.Operation,
          level: alarm.level.toString(),
          stationParameterId:
            stationsParameter[Math.floor(Math.random() * stationsParameter.length)].id,
          isActive: alarm.isActive.value,
          createdAt: alarm.createdAt.value,
          updatedAt: alarm.updatedAt?.value,
        },
      })
    }

    console.log(`✅ ${alarms.length} alarmes adicionados com sucesso!`)

    const createdAlarms = await prisma.alarm.findMany()
    const createdMeasures = await prisma.measure.findMany()

    for (let i = 0; i < 5; i++) {
      const randomAlarm = createdAlarms[Math.floor(Math.random() * createdAlarms.length)]
      const randomMeasure =
        createdMeasures[Math.floor(Math.random() * createdMeasures.length)]

      await prisma.alert.create({
        data: {
          alarmId: randomAlarm.id,
          measurementValue: randomMeasure.value,
          stationParameterId: randomMeasure.stationParameterId,
        },
      })
    }

    console.log('✅ 5 alerts adicionados com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}
