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
        return new AlarmLevel(Type[value.toLocaleUpperCase()])
    }

    public static createAsWarning(): AlarmLevel{
        return new AlarmLevel(Type.WARNING)
    }

    public static createAsCritical(): AlarmLevel{
        return new AlarmLevel(Type.CRITICAL)
    }
}