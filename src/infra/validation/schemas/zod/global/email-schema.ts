import { z } from 'zod'

export const emailSchema = z.email({ message: 'email inválido' })
