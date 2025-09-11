import { ValidationException } from "@/core/global/domain/exceptions/validation-exception"
import { Logical, Text } from "@/core/global/domain/structures"

export enum Type{
    WARNING,
    CRITICAL
}

export default class AlarmLevel{
    private type: Type
    private constructor(type: Type){
        this.type = type
    }

    public static create(value: string): AlarmLevel{
        if (value === "") {
            throw new ValidationException("Nível de alarme", "não pode ser nulo")
        }
        const text = Text.create(value.toLocaleUpperCase())

        try {
            return new AlarmLevel(Type[text.value])   
        } catch (error) {
            throw new ValidationException("Nível de alarme", "com valor inválido")
        }
    }

    public static createAsWarning(): AlarmLevel{
        return new AlarmLevel(Type.WARNING)
    }

    public static createAsCritical(): AlarmLevel{
        return new AlarmLevel(Type.CRITICAL)
    }

    public isTypeWarning(): Logical{
        return Logical.create(this.type === Type.WARNING)
    }

    public isTypeCritical(): Logical{
        return Logical.create(this.type === Type.CRITICAL)
    }

    public toString(): string{
        return this.type.toString().toLocaleLowerCase()
    }
}