import { HydratedDocument } from 'mongoose'

import { ReadingModel } from '@/infra/database/mongoose/models'

export type MongooseReading = HydratedDocument<ReadingModel>
