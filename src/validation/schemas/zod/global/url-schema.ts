import { z } from "zod";

export const urlSchema = z.url({ message: 'url inválida' })
