import { ValidationException } from "@/core/global/domain/exceptions/validation-exception";

export class BigInteger {
	private readonly value: bigint;
	private constructor(value: bigint) {
		this.value = value;
	}
	public static createFromNumber(value: number): BigInteger {
		if (!Number.isInteger(value)) {
			throw new ValidationException("value", "must be an integer");
		}
		return new BigInteger(BigInt(value));
	}
	public static createFromString(value: string): BigInteger {
		if (!/^-?\d+$/.test(value)) {
			throw new ValidationException("value", "must be a valid integer string");
		}
		return new BigInteger(BigInt(value));
	}
	public static createFromBigInt(value: bigint): BigInteger {
		return new BigInteger(value);
	}

	public getValue(): bigint {
		return this.value;
	}
	public equals(other: BigInteger): boolean {
		return this.value === other.value;
	}
}
