
import { ValidationException } from "@/core/global/domain/errors"
import { Logical} from "@/core/global/domain/structures"

export type Type = "WARNING" | "CRITICAL"

export default class AlarmLevel{
    private type: Type
    private constructor(type: Type){
        this.type = type
    }

    public static create(value: string): AlarmLevel{
        if (!value) {
            throw new ValidationException("Nível de alarme", "não pode ser nulo")
        }

        try {
            return new AlarmLevel(value as Type)   
        } catch (error) {
            throw new ValidationException("Nível de alarme", "com valor inválido")
        }
    }

    public static createAsWarning(): AlarmLevel{
        return new AlarmLevel("WARNING")
    }

    public static createAsCritical(): AlarmLevel{
        return new AlarmLevel("CRITICAL")
    }

    public isTypeWarning(): Logical{
        return Logical.create(this.type === "WARNING")
    }

    public isTypeCritical(): Logical{
        return Logical.create(this.type === "CRITICAL")
    }

    public toString(): string{
        return this.type.toString().toLocaleLowerCase()
    }
}