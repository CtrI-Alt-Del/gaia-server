
import { ValidationException } from "@/core/global/domain/errors"
import { Logical, Text } from "@/core/global/domain/structures"

export enum Type {
    BIGGER,
    LESS,
    BIGGER_EQUAL,
    LESS_EQUAL,
    EQUAL
}

export default class Operation{
    private value: Type
    private constructor(type: Type){
        this.value = type
    }

    public static create(value: string): Operation{
        if (value === "") {
            throw new ValidationException("Tipo de operação", "não pode ser nulo")
        }

        const text = Text.create(value.toLocaleUpperCase())

        try {
            return new Operation(Type[text.value])   
        } catch (error) {
            throw new ValidationException("Tipo de operação", "com valor inválido")
        }
    }

    static createAsBigger(): Operation{
        return new Operation(Type.BIGGER)
    }

    static createAsLess(): Operation{
        return new Operation(Type.LESS)
    }

    static createAsBiggerEqual(): Operation{
        return new Operation(Type.BIGGER_EQUAL)
    }

    static createAsLessEqual(): Operation{
        return new Operation(Type.LESS_EQUAL)
    }

    static createAsEqual(): Operation{
        return new Operation(Type.EQUAL)
    }

    public isTypeBigger(): Logical{
        return Logical.create(this.value === Type.BIGGER)
    }

    public isTypeLess(): Logical{
        return Logical.create(this.value === Type.LESS)
    }

    public isTypeBiggerEqual(): Logical{
        return Logical.create(this.value === Type.BIGGER_EQUAL)
    }

    public isTypeLessEqual(): Logical{
        return Logical.create(this.value === Type.LESS_EQUAL)
    }

    public isTypeEqual(): Logical{
        return Logical.create(this.value === Type.EQUAL)
    }

    public toString(): string{
        return this.value.toString().toLocaleLowerCase()
    }
}