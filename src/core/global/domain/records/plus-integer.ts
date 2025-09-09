export class PlusInteger {
	private readonly value: number;
	private constructor(value: number) {
		this.value = value;
	}
	public static create(value: number): PlusInteger {
		if (!Number.isInteger(value) || value < 0) {
			throw new Error("Value must be a positive integer");
		}
		return new PlusInteger(value);
	}
	public getValue(): number {
		return this.value;
	}
	public equals(other: PlusInteger): boolean {
		return this.value === other.value;
	}
	public plus(other: PlusInteger): PlusInteger {
		return new PlusInteger(this.value + other.value);
	}
	public minus(other: PlusInteger): PlusInteger {
		const result = this.value - other.value;
		if (result < 0) {
			throw new Error("Result must be a positive integer");
		}
		return new PlusInteger(result);
	}
}
