import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvProvider } from './provision/env/env-provider'
import { AppModule } from './app.module'
import { RestExceptionsFilter } from './rest/filters/rest-exception.filter'
import { apiReference } from '@scalar/nestjs-api-reference'
import { seed } from './database/prisma/seed'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gaia API')
    .setDescription('Gaia API description')
    .setVersion('1.0')
    .addTag('gaia')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, document)

  const envProvider = app.get(EnvProvider)
  const port = envProvider.get('PORT')

  envProvider.get('MODE') === 'staging' && (await seed())

  app.enableCors()

  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  )

  app.useGlobalFilters(new RestExceptionsFilter())
  await app.listen(port)
}
bootstrap()
