import { AppException } from "@/core/global/domain/exceptions/app-exception";

export class ValidationException extends AppException {
	constructor(key: string, message: string) {
		super(key + " " + message, "Validation Error");
	}
}
