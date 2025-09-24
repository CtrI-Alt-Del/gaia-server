import { ValidationException } from "@/core/global/domain/errors";
import { Logical, Text } from "@/core/global/domain/structures";

export type type = "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL" | "EQUAL";

export default class Operation {
  private value: type;
  private constructor(type: type) {
    this.value = type;
  }

  public static create(value: string): Operation {
    if (!value) {
      throw new ValidationException("Tipo de operação", "não pode ser nulo");
    }

    const text = Text.create(value.toLocaleUpperCase());

    try {
      return new Operation(text.value as type);
    } catch (error) {
      throw new ValidationException("Tipo de operação", "com valor inválido");
    }
  }

  static createAsGreaterThan(): Operation {
    return new Operation("GREATER_THAN");
  }

  static createAsLessThan(): Operation {
    return new Operation("LESS_THAN");
  }

  static createAsGreaterThanOrEqual(): Operation {
    return new Operation("GREATER_THAN_OR_EQUAL");
  }

  static createAsLessThanOrEqual(): Operation {
    return new Operation("LESS_THAN_OR_EQUAL");
  }

  static createAsEqual(): Operation {
    return new Operation("EQUAL");
  }

  public isTypeGreaterThan(): Logical {
    return Logical.create(this.value === "GREATER_THAN");
  }

  public isTypeLessThan(): Logical {
    return Logical.create(this.value === "LESS_THAN");
  }

  public isTypeGreaterThanOrEqual(): Logical {
    return Logical.create(this.value === "GREATER_THAN_OR_EQUAL");
  }

  public isTypeLessThanOrEqual(): Logical {
    return Logical.create(this.value === "LESS_THAN_OR_EQUAL");
  }

  public isTypeEqual(): Logical {
    return Logical.create(this.value === "EQUAL");
  }

  public toString(): string {
    return this.value.toString().toLocaleUpperCase();
  }
}
