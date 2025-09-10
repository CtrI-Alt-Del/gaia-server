export enum Type {
    BIGGER,
    LESS,
    BIGGER_EQUAL,
    LESS_EQUAL,
    EQUAL
}

export default class Operation{
    private type: Type
    private constructor(type: Type){
        this.type = type
    }

    public static create(value: string): Operation{
        return new Operation(Type[value.toLocaleUpperCase()])
    }

    public static createAsBigger(): Operation{
        return new Operation(Type.BIGGER)
    }

    public static createAsLess(): Operation{
        return new Operation(Type.LESS)
    }

    public static createAsBiggerEqual(): Operation{
        return new Operation(Type.BIGGER_EQUAL)
    }

    public static createAsLessEqual(): Operation{
        return new Operation(Type.LESS_EQUAL)
    }

    public static createAsEqual(): Operation{
        return new Operation(Type.EQUAL)
    }
}