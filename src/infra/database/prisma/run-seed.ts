import { seed } from './seed'

seed()
  .then(() => {
    console.log('🎉 Seed concluído com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha no seed:', error)
    process.exit(1)
  })
