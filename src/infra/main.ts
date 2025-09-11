import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/infra/app.module'
import { EnvProvider } from './provision/env/env-provider'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envProvider = app.get(EnvProvider)
  const port = envProvider.get('PORT')
  await app.listen(port)
}
bootstrap()
