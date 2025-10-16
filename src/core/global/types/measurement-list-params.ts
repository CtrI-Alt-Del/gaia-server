import { Text, Timestamp } from "../domain/structures";
import { CursorPaginationParams, ListingParams } from "../domain/types";

export type MeasurementListParams = ListingParams & CursorPaginationParams & {
    stationName?: Text,
    parameterName?: Text,
    date?: Text
}