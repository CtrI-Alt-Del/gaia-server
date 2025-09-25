import { CursorPaginationDto } from "@/core/global/domain/structures/dtos"
import { AlarmsRepository, UseCase } from "@/core/global/interfaces"
import { AlarmDto } from "../dtos/alarm.dto"
import { Id, PlusInteger, Status } from "@/core/global/domain/structures"

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
}

export class ListAlarmUseCase implements UseCase<Request, CursorPaginationDto<AlarmDto>>{
    constructor(private readonly repository: AlarmsRepository) {}

    async execute(params: Request): Promise<CursorPaginationDto<AlarmDto>> {
        const pagination = await this.repository.findMany({
            nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
            previousCursor: params.previousCursor ? Id.create(params.previousCursor) : undefined,
            pageSize: PlusInteger.create(params.pageSize),
            status: Status.create(params.status),
        })
        
        return pagination.map((alarm) => alarm.dto).dto
    }
}