import { Module } from '@nestjs/common'

import { Prisma } from './prisma/prisma'
import {
  PrismaAlarmsRepository,
  PrismaParametersRepository,
  PrismaStationsRepository,
  PrismaUsersRepository,
} from './prisma/repositories'
import { EnvProviderModule } from '@/infra/provision/env/env-provider.module'
import { MongooseModule } from '@nestjs/mongoose'

import { EnvProvider } from '@/infra/provision/env/env-provider'
import { ReadingModel } from '@/infra/database/mongoose/models/reading-model'
import { PrismaMeasurementsRepository } from './prisma/repositories/prisma-measurements-repository'
import { PrismaAlertsRepository } from './prisma/repositories/prisma-alerts-repository'
import { ReadingSchema } from './mongoose/schemas'
import { MongooseReadingsRepository } from './mongoose/repositories'
import { DatetimeProviderModule } from '../provision/datetime/datetime-provider.module'

@Module({
  providers: [
    Prisma,
    {
      provide: DatabaseModule.USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
    {
      provide: DatabaseModule.PARAMETERS_REPOSITORY,
      useClass: PrismaParametersRepository,
    },
    {
      provide: DatabaseModule.ALARMS_REPOSITORY,
      useClass: PrismaAlarmsRepository,
    },
    {
      provide: DatabaseModule.STATIONS_REPOSITORY,
      useClass: PrismaStationsRepository,
    },
    {
      provide: DatabaseModule.MEASUREMENTS_REPOSITORY,
      useClass: PrismaMeasurementsRepository,
    },
    {
      provide: DatabaseModule.ALERTS_REPOSITORY,
      useClass: PrismaAlertsRepository,
    },
    {
      provide: DatabaseModule.READINGS_REPOSITORY,
      useClass: MongooseReadingsRepository,
    },
  ],
  imports: [
    EnvProviderModule,
    DatetimeProviderModule,
    MongooseModule.forRootAsync({
      imports: [EnvProviderModule],
      inject: [EnvProvider],
      useFactory: async (envProvider: EnvProvider) => ({
        uri: envProvider.get('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: ReadingModel.name, schema: ReadingSchema }]),
  ],
  exports: [
    Prisma,
    DatabaseModule.USERS_REPOSITORY,
    DatabaseModule.PARAMETERS_REPOSITORY,
    DatabaseModule.ALARMS_REPOSITORY,
    DatabaseModule.STATIONS_REPOSITORY,
    DatabaseModule.MEASUREMENTS_REPOSITORY,
    DatabaseModule.ALERTS_REPOSITORY,
    DatabaseModule.READINGS_REPOSITORY,
  ],
})
export class DatabaseModule {
  static readonly USERS_REPOSITORY = 'USERS_REPOSITORY'
  static readonly PARAMETERS_REPOSITORY = 'PARAMETERS_REPOSITORY'
  static readonly ALARMS_REPOSITORY = 'ALARMS_REPOSITORY'
  static readonly STATIONS_REPOSITORY = 'STATIONS_REPOSITORY'
  static readonly MEASUREMENTS_REPOSITORY = 'MEASUREMENTS_REPOSITORY'
  static readonly ALERTS_REPOSITORY = 'ALERTS_REPOSITORY'
  static readonly READINGS_REPOSITORY = 'READINGS_REPOSITORY'
}
