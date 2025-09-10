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
		const date = new Date(Number(value));
		return new Timestamp(date);
	}
	static createFromNow(): Timestamp {
		return new Timestamp(new Date());
	}

	get bigInteger(): BigInteger {
		return BigInteger.createFromNumber(this.value.getTime());
	}
}
