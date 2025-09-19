export type MeasurementAggregateDto = {
  id: string;
  entity?: {
    value: number,
    stationuuid: string
    createdAt: Date;
  };
};
