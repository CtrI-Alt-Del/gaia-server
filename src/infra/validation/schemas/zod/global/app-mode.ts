import { z } from "zod";

export const appModeSchema = z.enum(["dev", "staging", "prod"]);
