import { Id, Logical, Timestamp } from '@/core/global/domain/structures'

export type EnityProps = {
  isActive?: Logical
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export class Entity<Props extends EnityProps> {
  readonly id: Id
  protected readonly props: Props
  private _isActive: Logical
  private _updatedAt?: Timestamp
  private readonly _createdAt: Timestamp

  protected constructor(props: Props, id?: string) {
    console.log('props', props.isActive)
    this.id = id ? Id.create(id) : Id.createRandom()
    this.props = props
    this._isActive = props.isActive ?? Logical.createAsTrue()
    this._createdAt = props.createdAt ?? Timestamp.createFromNow()
    this._updatedAt = props.updatedAt
  }

  isEqual(entity: Entity<Props>): Logical {
    return this.id.equals(entity.id)
  }

  get isActive(): Logical {
    return this._isActive
  }

  get createdAt(): Timestamp {
    return this._createdAt
  }

  get updatedAt(): Timestamp | undefined {
    return this._updatedAt
  }

  protected refreshLastUpdate(): void {
    this._updatedAt = Timestamp.createFromNow()
  }

  activate(): void {
    if (this._isActive.isFalse) {
      this._isActive = Logical.create(true)
      this.refreshLastUpdate()
    }
  }

  deactivate(): void {
    if (this._isActive.isTrue) {
      this._isActive = Logical.create(false)
      this.refreshLastUpdate()
    }
  }
}
