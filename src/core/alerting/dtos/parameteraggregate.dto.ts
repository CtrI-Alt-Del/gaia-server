export type ParameterAggregateDto = {
  id: string;
  entity?: {
    name: string;
    unitOfMeasure: string;
    numberOfDecimalPlaces: number;
    factor: number;
    offset: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};
