import { numberSchema } from '../global'

export const longitudeSchema = numberSchema.min(-180).max(180)
