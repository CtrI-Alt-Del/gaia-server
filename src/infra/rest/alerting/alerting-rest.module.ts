import { DatabaseModule } from "@/infra/database/database.module";
import { QueueModule } from "@/infra/queue/queue.module";
import { Module } from "@nestjs/common";
import { CreateAlarmController } from "./alarm/create-alarm.controller";
import { ListAlarmController } from "./alarm/list-alarm.controller";

@Module({
  imports: [DatabaseModule, QueueModule],
  controllers: [
    CreateAlarmController,
    ListAlarmController
  ],
})
export class AlertingRestModule {}
