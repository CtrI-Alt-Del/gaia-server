-- CreateTable
CREATE TABLE "public"."station_parameters" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,

    CONSTRAINT "station_parameters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."station_parameters" ADD CONSTRAINT "station_parameters_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."station_parameters" ADD CONSTRAINT "station_parameters_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "public"."parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
