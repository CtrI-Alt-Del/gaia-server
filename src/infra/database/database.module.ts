import { Module } from '@nestjs/common'

import { Prisma } from './prisma/client'
import {
  PrismaAlarmsRepository,
  PrismaParametersRepository,
  PrismaStationsRepository,
  PrismaUsersRepository,
} from './prisma/repositories'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers'
import { EnvProviderModule } from '@/infra/provision/env/env-provider.module'

@Module({
  providers: [
    Prisma,
    PrismaParameterMapper,
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
  ],
  exports: [
    Prisma,
    DatabaseModule.USERS_REPOSITORY,
    DatabaseModule.PARAMETERS_REPOSITORY,
    DatabaseModule.ALARMS_REPOSITORY,
    DatabaseModule.STATIONS_REPOSITORY,
  ],
})
export class DatabaseModule {
  static readonly USERS_REPOSITORY = 'USERS_REPOSITORY'
  static readonly PARAMETERS_REPOSITORY = 'PARAMETERS_REPOSITORY'
  static readonly ALARMS_REPOSITORY = 'ALARMS_REPOSITORY'
  static readonly STATIONS_REPOSITORY = 'STATIONS_REPOSITORY'
}
