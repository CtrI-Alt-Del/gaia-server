import { Logical } from "@/core/global/domain/structures/logical";
import { PlusInteger } from "@/core/global/domain/structures/plus-integer";

export class Collection<Item> {
	readonly items: Item[];

	private constructor(items: Item[] = []) {
		this.items = items;
	}

	static create<Item>(items: Item[]): Collection<Item> {
		return new Collection(items);
	}

	static createFrom<Item, NewItem>(
		items: Item[],
		mapper: (item: Item, index: number) => NewItem,
	): Collection<NewItem> {
		return new Collection(items.map(mapper));
	}

	static empty<Item>(): Collection<Item> {
		return new Collection<Item>();
	}

	add(item: Item): Collection<Item> {
		return new Collection([...this.items, item]);
	}

	addMany(other: Collection<Item>): Collection<Item> {
		return new Collection([...this.items, ...other.items]);
	}

	remove(itemToRemove: Item): Collection<Item> {
		const newItems = this.items.filter((item) => item !== itemToRemove);
		return new Collection(newItems);
	}

	map<NewItem>(
		mapper: (item: Item, index: number) => NewItem,
	): Collection<NewItem> {
		return new Collection(this.items.map(mapper));
	}

	filter(predicate: (item: Item, index: number) => boolean): Collection<Item> {
		return new Collection(this.items.filter(predicate));
	}

	find(predicate: (item: Item, index: number) => boolean): Item | undefined {
		return this.items.find(predicate);
	}

	sortBy(keyExtractor: (item: Item) => string | number): Collection<Item> {
		const sortedItems = [...this.items].sort((a, b) => {
			const keyA = keyExtractor(a);
			const keyB = keyExtractor(b);
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		return new Collection(sortedItems);
	}

	includes(item: Item): Logical {
		return Logical.create(this.items.includes(item));
	}

	some(predicate: (item: Item) => boolean): Logical {
		return Logical.create(this.items.some(predicate));
	}

	getAt(index: number): Item | undefined {
		return this.items[index];
	}

	removeFirst(): Collection<Item> {
		return new Collection(this.items.slice(1));
	}

	removeLast(): Collection<Item> {
		return new Collection(this.items.slice(0, -1));
	}

	get length(): PlusInteger {
		return PlusInteger.create(this.items.length);
	}

	get isEmpty(): Logical {
		return Logical.create(this.items.length === 0);
	}

	get first(): Item | undefined {
		return this.items[0];
	}

	get last(): Item | undefined {
		return this.items[this.items.length - 1];
	}
}
