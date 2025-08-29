import { HiController } from "@/infra/http/controllers/hi.controller";
import { Module } from "@nestjs/common";

@Module({
	controllers: [HiController],
})
export class HttpModule {}
