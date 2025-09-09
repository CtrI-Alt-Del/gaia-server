export class Logical {
	private readonly value: boolean;
	private constructor(value: boolean) {
		this.value = value;
	}
	public static create(value: boolean): Logical {
		if (typeof value === "boolean") {
			return new Logical(value);
		}
		throw new Error("Value must be a boolean");
	}
	public getValue(): boolean {
		return this.value;
	}
	public equals(other: Logical): boolean {
		return this.value === other.value;
	}
	public static createAsTrue(): Logical {
		return new Logical(true);
	}
	public static createAsFalse(): Logical {
		return new Logical(false);
	}
	public isTrue(): boolean {
		return this.value === true;
	}
	public isFalse(): boolean {
		return this.value === false;
	}
	public becomeTrue(): Logical {
		return new Logical(true);
	}
	public becomeFalse(): Logical {
		return new Logical(false);
	}
}
