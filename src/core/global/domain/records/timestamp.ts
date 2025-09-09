import { BigInteger } from "@/core/global/domain/records/big-integer";

export class Timestamp {
	private readonly value: Date;
	private constructor(value: Date) {
		this.value = value;
	}
	public static createFromDate(value: Date): Timestamp {
		return new Timestamp(value);
	}
	public static createFromString(value: string): Timestamp {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			throw new Error("Value must be a valid date string");
		}
		return new Timestamp(date);
	}
	public static createFromNumber(value: number): Timestamp {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			throw new Error("Value must be a valid timestamp number");
		}
		return new Timestamp(date);
	}
	public static createFromBigInt(value: bigint): Timestamp {
		const date = new Date(Number(value));
		return new Timestamp(date);
	}
	public toBigInteger(): BigInteger {
		return BigInteger.create(this.value.getTime());
	}
}
