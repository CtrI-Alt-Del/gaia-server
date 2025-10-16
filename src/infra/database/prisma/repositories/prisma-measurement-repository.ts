import { MeasurementRepository } from "@/core/telemetry/interfaces/measurement-repository";
import { PrismaRepository } from "./prisma-repository";
import { CursorPagination } from "@/core/global/domain/structures";
import { MeasurementListParams } from "@/core/global/types/measurement-list-params";
import { Measurement } from "@/core/telemetry/domain/entities/measurement";
import { Injectable } from "@nestjs/common";
import { PrismaMeasurementMapper } from "../mappers/prisma-measurement-mapper";

@Injectable()
export class PrismaMeasurementRepository
  extends PrismaRepository
  implements MeasurementRepository
{
  async findMany({
    pageSize,
    nextCursor,
    previousCursor,
    status,
    date,
    parameterName,
    stationName,
  }: MeasurementListParams): Promise<CursorPagination<Measurement>> {
    const whereClause = {
      ...(status?.isAll.isTrue ? {} : { isActive: status?.isActive.isTrue }),
      ...(date ? { createdAt: { equals: date.value } } : {}),
      ...(parameterName ? {stationParameter: { parameter: {is: {name: {contains: parameterName.value}}}}} : {}),
      ...(stationName ? {stationParameter: { station: {is: {name: {contains: stationName.value}}}}} : {})
    }

    const include = {
      stationParameter: true,
    }

    const query = this.createPaginationQuery(
      this.prisma.measure,
      whereClause,
      undefined,
      undefined,
      include
    )

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize
    })

    return result.map(PrismaMeasurementMapper.toEntity)
  }
}
