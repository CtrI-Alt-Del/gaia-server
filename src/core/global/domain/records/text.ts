import { Logical } from "@/core/global/domain/records/";
import { PlusInteger } from "@/core/global/domain/records/plus-integer";

export class Text {
	private readonly value: string;
	constructor(value: string) {
		if (typeof value === "string") {
			this.value = value;
		}
		throw new Error("oi");
	}
	public toString(): string {
		return this.value;
	}
	public charctersCount(): PlusInteger {
		return PlusInteger.create(this.value.length);
	}
	public update(value: string): Text {
		return new Text(value);
	}
	public equalsTo(other: Text): Logical {
		return Logical.create(this.value === other.value);
	}
	public notEqualsTo(other: Text): Logical {
		return Logical.create(this.value !== other.value);
	}
}
