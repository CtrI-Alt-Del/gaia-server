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

    await prisma.alert.deleteMany()
    console.log('✅ Alerts removidos')

    await prisma.alarm.deleteMany()
    console.log('✅ Alarms removidos')

    await prisma.measurement.deleteMany()
    console.log('✅ Measures removidos')

    await prisma.alert.deleteMany()
    console.log('✅ Alerts removidos')

    await prisma.alarm.deleteMany()
    console.log('✅ Alarms removidos')

    await prisma.stationParameter.deleteMany()
    console.log('✅ StationParameters removidos')

    await prisma.station.deleteMany()
    console.log('✅ Stations removidas')

    await prisma.parameter.deleteMany()
    console.log('✅ Parameters removidos')

    await prisma.user.deleteMany()
    console.log('✅ Users removidos')

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

    const mainParameter = ParameterFaker.fake({
      code: 'plu',
    })
    const parameters = ParameterFaker.fakeMany(50)
    parameters.push(mainParameter)
    const prismaParameters = parameters.map(PrismaParameterMapper.toPrisma)

    await prisma.parameter.createMany({
      data: prismaParameters,
      skipDuplicates: true,
    })

    console.log(`✅ ${parameters.length} parâmetros adicionados com sucesso!`)

    const stationsParameter: {
      id: string
      stationId: string
      parameterId: string
    }[] = []

    let countMeasure = 0

    const stations = StationsFaker.fakeMany(100)

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

      let isMainParameterUsed = false
      const randomParameters = parameters.slice(0, Math.floor(Math.random() * 5) + 1)

      for (const parameter of randomParameters) {
        const stationParameter = await prisma.stationParameter.create({
          data: {
            stationId: station.id.value,
            parameterId: !isMainParameterUsed
              ? mainParameter.id.value
              : parameter.id.value,
          },
        })

        if (!isMainParameterUsed) {
          isMainParameterUsed = true
        }

        stationsParameter.push(stationParameter)

        const measurements = MeasurementFaker.fakeMany(Math.floor(Math.random() * 4))

        countMeasure += measurements.length

        for (const measurement of measurements) {
          const randomStationParameter =
            stationsParameter[Math.floor(Math.random() * stationsParameter.length)]

          const measurementData = {
            value: measurement.value.value,
            createdAt: measurement.createdAt.value,
            stationParameter: {
              connect: {
                id: randomStationParameter.id,
              },
            },
          }

          await prisma.measurement.create({
            data: measurementData,
          })
        }
      }
    }

    console.log(`✅ ${stations.length} stations adicionadas com sucesso!`)

    console.log(`✅ ${countMeasure} measurements adicionadas com sucesso!`)

    const alarms = AlarmsFaker.fakeMany(100)

    for (const alarm of alarms) {
      await prisma.alarm.create({
        data: {
          message: alarm.message.value,
          value: alarm.rule.threshold.value,
          operation: alarm.rule.operation.toString() as $Enums.Operation,
          level: alarm.level.value,
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
    const createdMeasures = await prisma.measurement.findMany()

    for (let i = 0; i < 50; i++) {
      const randomAlarm = createdAlarms[Math.floor(Math.random() * createdAlarms.length)]
      const randomMeasure =
        createdMeasures[Math.floor(Math.random() * createdMeasures.length)]

      const randomDate = new Date(
        `${Math.floor(Math.random() * (2025 - 2023 + 1) + 2023).toString()}-${Math.floor(Math.random() * (12 - 1 + 1) + 1).toString()}-${Math.floor(Math.random() * (28 - 1 + 1) + 1).toString()} 01:00`,
      )

      await prisma.alert.create({
        data: {
          alarmId: randomAlarm.id,
          measurementValue: randomMeasure.value,
          stationParameterId: randomMeasure.stationParameterId,
          createdAt: randomDate.toISOString(),
        },
      })
    }

    console.log('✅ 50 alerts adicionados com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}
