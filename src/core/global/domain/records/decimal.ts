export class Decimal {
	private readonly value: number;
	private constructor(value: number) {
		this.value = value;
	}
	public static createFromNumber(value: number): Decimal {
		return new Decimal(value);
	}
	public static createFromString(value: string): Decimal {
		const parsed = parseFloat(value);
		if (isNaN(parsed)) {
			throw new Error("Value must be a valid decimal string");
		}
		return new Decimal(parsed);
	}
	public getValue(): number {
		return this.value;
	}
}
