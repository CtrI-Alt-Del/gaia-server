import { NotFoundError } from "@/core/global/domain/errors";


export class AlarmNotFoundError extends NotFoundError{
    constructor(){
        super("Alarme não encontrado")
    }
}