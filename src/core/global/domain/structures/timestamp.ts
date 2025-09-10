import { ValidationException } from "@/core/global/domain/exceptions/validation-exception";
import { BigInteger } from "@/core/global/domain/structures/big-integer";

export class Timestamp {
	readonly value: Date;
	private constructor(value: Date) {
		this.value = value;
	}
	static createFromDate(value: Date): Timestamp {
		return new Timestamp(value);
	}
	static createFromString(value: string): Timestamp {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			throw new Error("Value must be a valid date string");
		}
		return new Timestamp(date);
	}
	static createFromNumber(value: number): Timestamp {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			throw new Error("Value must be a valid timestamp number");
		}
		return new Timestamp(date);
	}
	static createFromBigInt(value: bigint): Timestamp {
		if (
			value > BigInt(Number.MAX_SAFE_INTEGER) ||
			value < BigInt(Number.MIN_SAFE_INTEGER)
		) {
			throw new ValidationException(
				"BigInt",
				"Valor esta fora do intervalo seguro para conversão em Number",
			);
		}
		return Timestamp.createFromNumber(Number(value));
	}
	static createFromNow(): Timestamp {
		return new Timestamp(new Date());
	}

	get bigInteger(): BigInteger {
		return BigInteger.createFromNumber(this.value.getTime());
	}
  toDate(): Date {
    return this.value;
  }
}
