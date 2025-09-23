export type MeasurementAggregateDto = {
  id: string;
  entity?: {
    value: number,
    stationuuid: string,
    parameterId: string,
    createdAt: Date
  };
};
