export class AlarmAlreadyActivatedError extends Error{
    constructor(){
        super("Alarm is already activated")
        this.name = "AlarmAlreadyActivatedError"
    }
}