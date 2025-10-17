import { CursorPaginationDto } from "@/core/global/domain/structures/dtos";
import { UseCase } from "@/core/global/interfaces";
import { MeasurementDto } from "../domain/dtos/measurement-dto";
import { MeasurementRepository } from "../interfaces/measurement-repository";
import { Id, PlusInteger, Status, Text, Timestamp } from "@/core/global/domain/structures";

type Request = {
  name?: string
  stationId?: string
  parameterId?: string
  date?: string
  status: string
  nextCursor?: string
  previousCursor?: string
  pageSize: number
}

export class ListMeasurementsUseCase implements UseCase<Request, CursorPaginationDto<MeasurementDto>>{
    constructor(private readonly repository: MeasurementRepository) { }

    async execute(params: Request): Promise<CursorPaginationDto<MeasurementDto>> {
        const pagination = await this.repository.findMany({
            nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
            previousCursor: params.previousCursor ? Id.create(params.previousCursor) : undefined,
            name: params.name ? Text.create(params.name) : undefined,
            pageSize: PlusInteger.create(params.pageSize),
            status: params.status ? Status.create(params.status) : undefined,
            stationId: params.stationId ? Text.create(params.stationId) : undefined,
            parameterId: params.parameterId ? Text.create(params.parameterId) : undefined,
            date: params.date ? Text.create(params.date) : undefined
        })

        return pagination.map((measurement) => measurement.dto).dto
    }
}