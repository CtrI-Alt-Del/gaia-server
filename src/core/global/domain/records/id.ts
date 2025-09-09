import { randomUUID } from "crypto";

export class Id {
	private readonly value: string;
	private constructor(value: string) {
		this.value = value;
	}
	public static create(value: string): Id {
		return new Id(value);
	}
	public static random(): Id {
		return new Id(randomUUID());
	}
	public toString(): string {
		return this.value;
	}
	public equals(id: Id): boolean {
		return this.value === id.value;
	}
}
