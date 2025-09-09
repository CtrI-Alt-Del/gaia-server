export class Collection<Item> {
	private readonly items: readonly Item[];

	private constructor(items: readonly Item[] = []) {
		this.items = items;
	}

	public static create<Item>(items: readonly Item[]): Collection<Item> {
		return new Collection(items);
	}

	public static from<Item, NewItem>(
		items: readonly Item[],
		mapper: (item: Item, index: number) => NewItem,
	): Collection<NewItem> {
		return new Collection(items.map(mapper));
	}

	public static empty<T>(): Collection<T> {
		return new Collection<T>();
	}

	public add(item: Item): Collection<Item> {
		return new Collection([...this.items, item]);
	}

	public addMany(other: Collection<Item>): Collection<Item> {
		return new Collection([...this.items, ...other.toArray()]);
	}

	public remove(itemToRemove: Item): Collection<Item> {
		const newItems = this.items.filter((item) => item !== itemToRemove);
		return new Collection(newItems);
	}

	public map<NewItem>(mapper: (item: Item, index: number) => NewItem): Collection<NewItem> {
		return new Collection(this.items.map(mapper));
	}

	public filter(predicate: (item: Item, index: number) => boolean): Collection<Item> {
		return new Collection(this.items.filter(predicate));
	}

	public find(predicate: (item: Item, index: number) => boolean): Item | undefined {
		return this.items.find(predicate);
	}

	public sortBy(keyExtractor: (item: Item) => string | number): Collection<Item> {
		const sortedItems = [...this.items].sort((a, b) => {
			const keyA = keyExtractor(a);
			const keyB = keyExtractor(b);
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		return new Collection(sortedItems);
	}

	public includes(item: Item): boolean {
		return this.items.includes(item);
	}

	public some(predicate: (item: Item) => boolean): boolean {
		return this.items.some(predicate);
	}

	public at(index: number): Item | undefined {
		return this.items[index];
	}

	public removeFirst(): Collection<Item> {
		return new Collection(this.items.slice(1));
	}

	public removeLast(): Collection<Item> {
		return new Collection(this.items.slice(0, -1));
	}

	public get length(): number {
		return this.items.length;
	}

	public get isEmpty(): boolean {
		return this.items.length === 0;
	}

	public get first(): Item | undefined {
		return this.items[0];
	}

	public get last(): Item | undefined {
		return this.items[this.items.length - 1];
	}

	public toArray(): readonly Item[] {
		return this.items;
	}
}
