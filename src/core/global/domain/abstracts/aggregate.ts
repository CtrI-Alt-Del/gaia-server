import { Entity } from "@/core/global/domain/abstracts/entity";
import { Logical } from "@/core/global/domain/structures";

export abstract class Aggregate<Props, AggregableEntity> extends Entity<Props> {
	private readonly entity: AggregableEntity;
	private readonly entityName: string;

	protected constructor(
		props: Props,
		entity: AggregableEntity,
		entityName: string,
		id?: string,
	) {
		super(props, id);
		this.entity = entity;
		this.entityName = entityName;
	}

	getEntity(): AggregableEntity {
		if (this.hasEntity().isTrue()) {
			throw new Error(this.entityName);
		}
		return this.entity;
	}

	hasEntity(): Logical {
		const isEntityNotNullOrUndefined =
			this.entity !== null || this.entity !== undefined;
		return Logical.create(isEntityNotNullOrUndefined);
	}
}
