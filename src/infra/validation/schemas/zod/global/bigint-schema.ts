import { z } from 'zod'

export const bigIntSchema = z.coerce
  .bigint({ message: 'número inválido' })
