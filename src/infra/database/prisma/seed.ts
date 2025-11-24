import { $Enums, PrismaClient } from '@prisma/client'

import { UsersFaker } from '@/core/membership/domain/entities/fakers'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
import { PrismaUserMapper, PrismaParameterMapper } from './mappers'
import { AlarmsFaker } from '@/core/alerting/domain/entities/fakers/alarms-faker'
import { MeasurementFaker } from '@/core/telemetry/domain/entities/fakers/measurement-faker'
import { faker } from '@faker-js/faker'

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
    console.log('✅ Measurements removed')

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

    const mainParameter1 = ParameterFaker.fake({
      name: 'Qualidade do ar 1',
      code: 'pm1_0',
      factor: 2,
      offset: 0,
      unitOfMeasure: 'mm',
    })
    const mainParameter2 = ParameterFaker.fake({
      name: 'Qualidade do ar 2',
      code: 'pm2_5',
      factor: 2,
      offset: 0,
      unitOfMeasure: 'mm',
    })
    const mainParameter3 = ParameterFaker.fake({
      name: 'Qualidade do ar 3',
      code: 'pm10_0',
      factor: 2,
      offset: 0,
      unitOfMeasure: 'mm',
    })
    const mainParameters = [mainParameter1, mainParameter2, mainParameter3]
    const parameters = [
      ...mainParameters,
      ParameterFaker.fake({
        name: 'Temperatura do ar',
        code: 'tmp',
        unitOfMeasure: '°C',
      }),
      ParameterFaker.fake({
        name: 'Umidade relativa',
        code: 'hum',
        unitOfMeasure: '%',
      }),
      ParameterFaker.fake({
        name: 'Pressão atmosférica',
        code: 'prs',
        unitOfMeasure: 'hPa',
      }),
      ParameterFaker.fake({
        name: 'Velocidade do vento',
        code: 'wnd_spd',
        unitOfMeasure: 'm/s',
      }),
      ParameterFaker.fake({
        name: 'Direção do vento',
        code: 'wnd_dir',
        unitOfMeasure: '°',
      }),
      ParameterFaker.fake({
        name: 'Rajada de vento',
        code: 'wnd_gst',
        unitOfMeasure: 'm/s',
      }),
      ParameterFaker.fake({
        name: 'Pluviosidade',
        code: 'plu',
        unitOfMeasure: 'mm',
      }),
      ParameterFaker.fake({
        name: 'Radiação solar global',
        code: 'rad',
        unitOfMeasure: 'W/m²',
      }),
      ParameterFaker.fake({
        name: 'Índice UV',
        code: 'uvi',
        unitOfMeasure: 'índice',
      }),
      ParameterFaker.fake({
        name: 'Ponto de orvalho',
        code: 'dwp',
        unitOfMeasure: '°C',
      }),
      ParameterFaker.fake({
        name: 'Nebulosidade',
        code: 'cld',
        unitOfMeasure: '%',
      }),
      ParameterFaker.fake({
        name: 'Evapotranspiração',
        code: 'etp',
        unitOfMeasure: 'mm/dia',
      }),
      ParameterFaker.fake({
        name: 'Sensação térmica',
        code: 'st',
        unitOfMeasure: '°C',
      }),
      ParameterFaker.fake({
        name: 'Visibilidade horizontal',
        code: 'vis',
        unitOfMeasure: 'km',
      }),
    ]

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

    const stations = StationsFaker.fakeMany(99)
    const mainStation = StationsFaker.fake({
      uid: '08:B6:1F:2A:F4:60',
      name: 'Estação principal',
      address: 'São José dos Campos - SP',
      latitude: -23.1794,
      longitude: -45.8869,
    })
    stations.push(mainStation)

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

      const mainParametersIds = mainParameters.map((parameter) => parameter.id.value)
      const randomParameters = parameters.slice(0, Math.floor(Math.random() * 5) + 1)

      for (const parameter of randomParameters) {
        const mainParameterId = mainParametersIds.pop()
        const parameterId = mainParameterId ?? parameter.id.value

        const stationParameter = await prisma.stationParameter.create({
          data: {
            stationId: station.id.value,
            parameterId: parameterId,
          },
        })

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

    let alarmCount = 0

    const mainParametersIds = mainParameters.map((parameter) => parameter.id.value)

    while (alarmCount < 9) {
      const randomStationParameter =
        stationsParameter[Math.floor(Math.random() * stationsParameter.length)]

      if (mainParametersIds.includes(randomStationParameter.parameterId)) {
        continue
      }
      const alarm = AlarmsFaker.fake()
      await prisma.alarm.create({
        data: {
          message: alarm.message.value,
          value: 1000,
          operation: alarm.rule.operation.toString() as $Enums.Operation,
          level: alarm.level.value,
          stationParameterId: randomStationParameter.id,
          isActive: alarm.isActive.value,
          createdAt: alarm.createdAt.value,
          updatedAt: alarm.updatedAt?.value,
        },
      })
      alarmCount++
    }

    for (const mainParameter of mainParameters) {
      const mainStationParameter = await prisma.stationParameter.findFirst({
        where: {
          parameterId: mainParameter.id.value,
          stationId: mainStation.id.value,
        },
      })

      await prisma.alarm.create({
        data: {
          message: 'Qualidade do ar muito baixa',
          value: 99,
          operation: 'GREATER_THAN',
          level: 'CRITICAL',
          stationParameterId: mainStationParameter?.id as string,
          isActive: true,
          createdAt: new Date(),
        },
      })
      alarmCount++
    }

    console.log(`✅ ${alarmCount} alarmes adicionados com sucesso!`)

    console.log(`Estação com alerta principal: ${mainStation.name.value}`)

    const createdAlarms = await prisma.alarm.findMany()
    const createdMeasures = await prisma.measurement.findMany()

    for (let i = 0; i < 50; i++) {
      const randomAlarm = createdAlarms[Math.floor(Math.random() * createdAlarms.length)]
      const randomMeasure =
        createdMeasures[Math.floor(Math.random() * createdMeasures.length)]

      await prisma.alert.create({
        data: {
          alarmId: randomAlarm.id,
          measurementValue: randomMeasure.value,
          stationParameterId: randomMeasure.stationParameterId,
          isRead: true,
          createdAt: faker.date.between({ from: '2024-08-01', to: '2025-10-20' }),
        },
      })
    }

    console.log('✅ 50 alertas adicionados com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}
