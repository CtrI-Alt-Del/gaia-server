import { EnityProps, Entity } from '@/core/global/domain/abstracts/entity'
import { Logical } from '@/core/global/domain/structures'

export abstract class Aggregate<
  Props extends EnityProps,
  AggregableEntity,
> extends Entity<Props> {
  private readonly entityName: string
  private readonly entity?: AggregableEntity

  protected constructor(
    props: Props,
    entityName: string,
    entity?: AggregableEntity,
    id?: string,
  ) {
    super(props, id)
    this.entity = entity
    this.entityName = entityName
  }

  getEntity(): AggregableEntity {
    if (this.hasEntity().isFalse) {
      throw new Error(this.entityName)
    }
    return this.entity as AggregableEntity
  }

  hasEntity(): Logical {
    const isEntityNotNullOrUndefined = this.entity != undefined
    return Logical.create(isEntityNotNullOrUndefined)
  }
}
