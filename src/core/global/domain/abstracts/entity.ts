import { Id, Logical } from "@/core/global/domain/records";

export class Entity<Props> {
	readonly id: Id;
	protected readonly props: Props;
	private _isActive: Logical;
	private _updatedAt?: Date;
	private readonly _createdAt?: Date;
	protected constructor(props: Props, id?: string) {
		this.id = id ? Id.create(id) : Id.random();
		this.props = props;
		this._isActive = Logical.create(true);
		this._createdAt = new Date();
	}
	public isEqual(entity: Entity<Props>): Logical {
		return Logical.create(this.id.equals(entity.id));
	}
	get isActive(): Logical {
		return this._isActive;
	}
	get createdAt(): Date | undefined {
		return this._createdAt;
	}
	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}
	private touch(): void {
		this._updatedAt = new Date();
	}
	public activate(): void {
		if (this._isActive.isFalse()) {
			this._isActive = Logical.create(true);
			this.touch();
		}
	}

	public deactivate(): void {
		if (this._isActive.isTrue()) {
			this._isActive = Logical.create(false);
			this.touch();
		}
	}
}
