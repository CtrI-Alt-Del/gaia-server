/*
  Warnings:

  - You are about to drop the `Measure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Measure";

-- CreateTable
CREATE TABLE "public"."measure" (
    "id" TEXT NOT NULL,
    "stationParameterId" TEXT NOT NULL,
    "unit_of_measure" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."measure" ADD CONSTRAINT "measure_stationParameterId_fkey" FOREIGN KEY ("stationParameterId") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
