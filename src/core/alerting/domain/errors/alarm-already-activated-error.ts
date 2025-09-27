import { AppError } from "@/core/global/domain/errors"

export class AlarmAlreadyActivatedError extends AppError{
    constructor(){
        super("Alarm is already activated")
        this.name = "AlarmAlreadyActivatedError"
    }
}