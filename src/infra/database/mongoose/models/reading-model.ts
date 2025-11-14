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
  uxt: number

  @Prop({ required: true })
  topic: string
}
