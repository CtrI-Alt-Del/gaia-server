import { ValidationException } from "@/core/global/domain/exceptions/validation-exception";
import { Logical } from "@/core/global/domain/structures/logical";

export class BigInteger {
	readonly value: bigint;
	private constructor(value: bigint) {
		this.value = value;
	}
	static createFromNumber(value: number): BigInteger {
		if (!Number.isInteger(value)) {
			throw new ValidationException("value", "must be an integer");
		}
		return new BigInteger(BigInt(value));
	}
	static createFromString(value: string): BigInteger {
		if (!/^-?\d+$/.test(value)) {
			throw new ValidationException("value", "must be a valid integer string");
		}
		return new BigInteger(BigInt(value));
	}
	static create(value: bigint): BigInteger {
		return new BigInteger(value);
	}
	equals(other: BigInteger): Logical {
		return Logical.create(this.value === other.value);
	}
}
