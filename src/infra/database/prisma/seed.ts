import { UsersFaker } from '@/core/membership/domain/entities/fakers'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
import { PrismaClient } from '@prisma/client'
import { PrismaUserMapper, PrismaParameterMapper } from './mappers'

async function seed() {
  const prisma = new PrismaClient({
    log: process.env.LOG_LEVEL === 'debug' ? ['warn', 'error', 'info'] : [],
  })

  try {
    console.log('🌱 Iniciando seed do banco de dados...')

    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

    const users = UsersFaker.fakeMany(100)
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

    const stations = StationsFaker.fakeMany(100)

    for (const station of stations) {
      const stationData = {
        id: station.id.value,
        name: station.name.value,
        code: station.UID.value.value,
        address: station.adddress.value,
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
        await prisma.stationParameter.create({
          data: {
            stationId: station.id.value,
            parameterId: parameter.id.value,
          },
        })
      }
    }

    console.log(`✅ ${stations.length} stations adicionadas com sucesso!`)
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .then(() => {
    console.log('🎉 Seed concluído com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha no seed:', error)
    process.exit(1)
  })
