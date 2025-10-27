/*
  Warnings:

  - You are about to drop the `measure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."measure" DROP CONSTRAINT "measure_station_parameter_id_fkey";

-- DropTable
DROP TABLE "public"."measure";

-- CreateTable
CREATE TABLE "public"."measurements" (
    "id" TEXT NOT NULL,
    "station_parameter_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."measurements" ADD CONSTRAINT "measurements_station_parameter_id_fkey" FOREIGN KEY ("station_parameter_id") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
