export class BigInteger {
	private readonly value: bigint;
	private constructor(value: bigint) {
		this.value = value;
	}
	public static create(value: bigint | number | string): BigInteger {
		if (typeof value === "number") {
			if (!Number.isInteger(value)) {
				throw new Error("Value must be an integer");
			}
			return new BigInteger(BigInt(value));
		} else if (typeof value === "string") {
			if (!/^-?\d+$/.test(value)) {
				throw new Error("Value must be a valid integer string");
			}
			return new BigInteger(BigInt(value));
		} else if (typeof value === "bigint") {
			return new BigInteger(value);
		} else {
			throw new Error("Value must be a bigint, number, or string");
		}
	}
  public getValue(): bigint {
    return this.value;
  }
  public equals(other: BigInteger): boolean {
    return this.value === other.value;
  }
}
