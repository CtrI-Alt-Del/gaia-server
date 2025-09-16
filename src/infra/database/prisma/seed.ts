import { UsersFaker } from '@/core/membership/domain/entities/fakers'
import { PrismaClient } from '@prisma/client'
import { PrismaUserMapper } from './mappers'

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
