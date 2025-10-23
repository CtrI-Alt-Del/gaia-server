import { Module } from '@nestjs/common'

import { Prisma } from './prisma/prisma'
import {
  PrismaAlarmsRepository,
  PrismaParametersRepository,
  PrismaStationsRepository,
  PrismaUsersRepository,
} from './prisma/repositories'
import { EnvProviderModule } from '@/infra/provision/env/env-provider.module'
import { PrismaMeasurementsRepository } from './prisma/repositories/prisma-measurements-repository'
import { PrismaAlertsRepository } from './prisma/repositories/prisma-alerts-repository'
import { MongooseModule } from '@nestjs/mongoose'
import {
  MongooseMeasurementsRepository,
  RawMeasurementModel,
} from '@/infra/database/mongo'
import { RawMeasurementSchema } from '@/infra/database/mongo/schemas/raw-measurement-schema'
import { EnvProvider } from '@/infra/provision/env/env-provider'

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
      provide: DatabaseModule.MONGO_MEASUREMENTS_REPOSITORY,
      useClass: MongooseMeasurementsRepository,
    },
  ],
  imports: [
    EnvProviderModule,
    MongooseModule.forRootAsync({
      imports: [EnvProviderModule],
      inject: [EnvProvider],
      useFactory: async (envProvider: EnvProvider) => {
        const mongoUri = envProvider.get('MONGO_URI')
        if (!mongoUri) {
          throw new Error('MONGO_URI is not defined in environment variables')
        }
        return {
          uri: mongoUri,
        }
      },
    }),
    MongooseModule.forFeature([
      { name: RawMeasurementModel.name, schema: RawMeasurementSchema },
    ]),
  ],
  exports: [
    Prisma,
    DatabaseModule.USERS_REPOSITORY,
    DatabaseModule.PARAMETERS_REPOSITORY,
    DatabaseModule.ALARMS_REPOSITORY,
    DatabaseModule.STATIONS_REPOSITORY,
    DatabaseModule.MEASUREMENTS_REPOSITORY,
    DatabaseModule.ALERTS_REPOSITORY,
    DatabaseModule.MONGO_MEASUREMENTS_REPOSITORY
  ],
})
export class DatabaseModule {
  static readonly USERS_REPOSITORY = 'USERS_REPOSITORY'
  static readonly PARAMETERS_REPOSITORY = 'PARAMETERS_REPOSITORY'
  static readonly ALARMS_REPOSITORY = 'ALARMS_REPOSITORY'
  static readonly STATIONS_REPOSITORY = 'STATIONS_REPOSITORY'
  static readonly MEASUREMENTS_REPOSITORY = 'MEASUREMENTS_REPOSITORY'
  static readonly ALERTS_REPOSITORY = 'ALERTS_REPOSITORY'
  static readonly MONGO_MEASUREMENTS_REPOSITORY = 'MONGO_MEASUREMENTS_REPOSITORY'
}
