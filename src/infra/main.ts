import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvProvider } from './provision/env/env-provider'
import { AppModule } from './app.module'
import { RestExceptionsFilter } from './rest/filters/rest-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gaia API')
    .setDescription('Gaia API description')
    .setVersion('1.0')
    .addTag('gaia')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  const configService = app.get(EnvProvider)
  const port = configService.get('PORT')

  app.useGlobalFilters(new RestExceptionsFilter())
  await app.listen(port)
}
bootstrap()
