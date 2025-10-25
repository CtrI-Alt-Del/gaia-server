import { RawMeasurementModel } from "@/infra/database/mongo/schemas";
import { Document } from "mongoose";

export type RawMeasurementDocument = RawMeasurementModel & Document
