import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
  strict: false,
  timestamps: false,
  collection: 'readings',
  versionKey: false,
})
export class ReadingModel {
  @Prop({ required: true })
  uid: string

  @Prop({ required: true })
  receivedAt: Date

  @Prop({ required: true })
  topic: string
}
