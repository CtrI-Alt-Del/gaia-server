import { ValidationException } from "@/core/global/domain/errors";
import { Logical, Text } from "@/core/global/domain/structures";

export type type = "BIGGER" | "LESS" | "BIGGER_EQUAL" | "LESS_EQUAL" | "EQUAL";

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

  static createAsBigger(): Operation {
    return new Operation("BIGGER");
  }

  static createAsLess(): Operation {
    return new Operation("LESS");
  }

  static createAsBiggerEqual(): Operation {
    return new Operation("BIGGER_EQUAL");
  }

  static createAsLessEqual(): Operation {
    return new Operation("LESS_EQUAL");
  }

  static createAsEqual(): Operation {
    return new Operation("EQUAL");
  }

  public isTypeBigger(): Logical {
    return Logical.create(this.value === "BIGGER");
  }

  public isTypeLess(): Logical {
    return Logical.create(this.value === "LESS");
  }

  public isTypeBiggerEqual(): Logical {
    return Logical.create(this.value === "BIGGER_EQUAL");
  }

  public isTypeLessEqual(): Logical {
    return Logical.create(this.value === "LESS_EQUAL");
  }

  public isTypeEqual(): Logical {
    return Logical.create(this.value === "EQUAL");
  }

  public toString(): string {
    return this.value.toString().toLocaleLowerCase();
  }
}
