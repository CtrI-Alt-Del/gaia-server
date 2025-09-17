import { z } from 'zod'

export const numberSchema = z.coerce
  .number({ message: 'número inválido' })
