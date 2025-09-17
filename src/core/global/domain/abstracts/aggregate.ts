import { EnityProps, Entity } from '@/core/global/domain/abstracts/entity'
import { Logical } from '@/core/global/domain/structures'

type Props<AggregableEntity> = {
  entity?: AggregableEntity
} & EnityProps

export abstract class Aggregate<AggregableEntity> extends Entity<Props<AggregableEntity>> {
  private readonly entityName: string

  protected constructor(
    entityName: string,
    id: string,
    entity?: AggregableEntity
  ) {
    super({entity}, id)
    this.entityName = entityName
  }

  getEntity(): AggregableEntity {
    if (this.hasEntity().isFalse) {
      throw new Error(this.entityName)
    }
    return this.props.entity as AggregableEntity
  }

  hasEntity(): Logical {
    const isEntityNotNullOrUndefined = this.props.entity != undefined
    return Logical.create(isEntityNotNullOrUndefined)
  }
}
