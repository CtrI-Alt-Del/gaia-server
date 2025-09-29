import { Text } from "../domain/structures";
import { CursorPaginationParams, ListingParams } from "../domain/types";

export type AlarmListingParams = ListingParams & CursorPaginationParams & {level?: Text}