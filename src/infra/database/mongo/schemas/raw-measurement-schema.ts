import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({
  strict: false,
  timestamps: false,
  collection: 'sensor_data',
  versionKey: false
})
export class RawMeasurementModel {
  @Prop({ required: true })
  uid: string

  @Prop({ required: true })
  receivedAt: Date

  @Prop({ required: true })
  topic: string

  @Prop({ type: Boolean, required: false, index: true })
  processed?: boolean
}
export const RawMeasurementSchema = SchemaFactory.createForClass(RawMeasurementModel)
