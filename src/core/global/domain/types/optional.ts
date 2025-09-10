export type Optional<
	ObjectType,
	KeysToMakeOptional extends keyof ObjectType,
> = Pick<Partial<ObjectType>, KeysToMakeOptional> &
	Omit<ObjectType, KeysToMakeOptional>;
