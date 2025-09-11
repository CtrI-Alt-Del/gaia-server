import { z } from 'zod'

export const integerSchema = z.coerce
  .number({ message: 'número inválido' })
