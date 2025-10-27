import { SchemaFactory } from '@nestjs/mongoose'

import { ReadingModel } from './models'

export const ReadingSchema = SchemaFactory.createForClass(ReadingModel)
