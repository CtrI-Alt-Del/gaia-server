import { ValidationException } from '@/core/global/domain/errors'
import { Logical, Text } from '@/core/global/domain/structures'

export type type = 'WARNING' | 'CRITICAL'

export class AlarmLevel {
  private value: type
  private constructor(value: type) {
    this.value = value
  }

  public static create(value: string): AlarmLevel {
    if (!value) {
      throw new ValidationException('Nível de alarme', 'não pode ser nulo')
    }

    const text = Text.create(value.toLocaleUpperCase())

    try {
      return new AlarmLevel(text.value as type)
    } catch {
      throw new ValidationException('Nível de alarme', 'com valor inválido')
    }
  }

  public static createAsWarning(): AlarmLevel {
    return new AlarmLevel('WARNING')
  }

  public static createAsCritical(): AlarmLevel {
    return new AlarmLevel('CRITICAL')
  }

  public isTypeWarning(): Logical {
    return Logical.create(this.value === 'WARNING')
  }

  public isTypeCritical(): Logical {
    return Logical.create(this.value === 'CRITICAL')
  }

  public toString(): string {
    return this.value.toString().toLocaleLowerCase()
  }
}
