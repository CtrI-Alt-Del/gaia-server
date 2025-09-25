import { DatabaseModule } from "@/infra/database/database.module";
import { QueueModule } from "@/infra/queue/queue.module";
import { Module } from "@nestjs/common";
import { CreateAlarmController } from "./controllers/alarm/create-alarm.controller";
import { ActivateAlarmController } from "./controllers/alarm/activate-alarm.controller";

@Module({
  imports: [DatabaseModule, QueueModule],
  controllers: [
    CreateAlarmController,
    ActivateAlarmController
  ],
})
export class AlertingRestModule {}
