import { Controller, Get } from "@nestjs/common";

@Controller()
export class HiController {
	@Get("/hi")
	async handle() {
		return {hi: "Hello word"}
	}
}
