
import { EnvService } from '@/infra/env/env.service'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from 'src/infra/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gaia API')
    .setDescription('The Gaia API description')
    .setVersion('1.0')
    .addTag('gaia')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)
  const configService = app.get(EnvService)
  const port = configService.get('PORT')
  await app.listen(port)
}
bootstrap()
