import { CursorPaginationParams, ListingParams } from "@/core/global/domain/types";
import { Text } from "@/core/global/domain/structures/text";

export type ParametersListParams = (ListingParams & CursorPaginationParams) & {
    name?: Text;
}
