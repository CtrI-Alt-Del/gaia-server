export class Collection<T> {
	private readonly items: readonly T[];

	private constructor(items: readonly T[] = []) {
		this.items = items;
	}

	public static create<T>(items: readonly T[]): Collection<T> {
		return new Collection(items);
	}

	public static from<U, T>(
		items: readonly U[],
		mapper: (item: U, index: number) => T,
	): Collection<T> {
		return new Collection(items.map(mapper));
	}

	public static empty<T>(): Collection<T> {
		return new Collection<T>();
	}

	public add(item: T): Collection<T> {
		return new Collection([...this.items, item]);
	}

	public addMany(other: Collection<T>): Collection<T> {
		return new Collection([...this.items, ...other.toArray()]);
	}

	public remove(itemToRemove: T): Collection<T> {
		const newItems = this.items.filter((item) => item !== itemToRemove);
		return new Collection(newItems);
	}

	public map<U>(mapper: (item: T, index: number) => U): Collection<U> {
		return new Collection(this.items.map(mapper));
	}

	public filter(predicate: (item: T, index: number) => boolean): Collection<T> {
		return new Collection(this.items.filter(predicate));
	}

	public find(predicate: (item: T, index: number) => boolean): T | undefined {
		return this.items.find(predicate);
	}

	public sortBy(keyExtractor: (item: T) => string | number): Collection<T> {
		const sortedItems = [...this.items].sort((a, b) => {
			const keyA = keyExtractor(a);
			const keyB = keyExtractor(b);
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		return new Collection(sortedItems);
	}

	public includes(item: T): boolean {
		return this.items.includes(item);
	}

	public some(predicate: (item: T) => boolean): boolean {
		return this.items.some(predicate);
	}

	public at(index: number): T | undefined {
		return this.items[index];
	}

	public removeFirst(): Collection<T> {
		return new Collection(this.items.slice(1));
	}

	public removeLast(): Collection<T> {
		return new Collection(this.items.slice(0, -1));
	}

	public get length(): number {
		return this.items.length;
	}

	public get isEmpty(): boolean {
		return this.items.length === 0;
	}

	public get first(): T | undefined {
		return this.items[0];
	}

	public get last(): T | undefined {
		return this.items[this.items.length - 1];
	}

	public toArray(): readonly T[] {
		return this.items;
	}
}
