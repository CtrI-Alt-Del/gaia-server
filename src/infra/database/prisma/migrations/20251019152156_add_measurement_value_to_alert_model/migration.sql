/*
  Warnings:

  - You are about to drop the column `measurement_id` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `stationParameterId` on the `measure` table. All the data in the column will be lost.
  - You are about to drop the column `parameterId` on the `station_parameters` table. All the data in the column will be lost.
  - You are about to drop the column `stationId` on the `station_parameters` table. All the data in the column will be lost.
  - Added the required column `measurement_value` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `station_parameter_id` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `station_parameter_id` to the `measure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parameter_id` to the `station_parameters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `station_id` to the `station_parameters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."alerts" DROP CONSTRAINT "alerts_measurement_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."measure" DROP CONSTRAINT "measure_stationParameterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."station_parameters" DROP CONSTRAINT "station_parameters_parameterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."station_parameters" DROP CONSTRAINT "station_parameters_stationId_fkey";

-- AlterTable
ALTER TABLE "public"."alerts" DROP COLUMN "measurement_id",
ADD COLUMN     "measurement_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "station_parameter_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."measure" DROP COLUMN "stationParameterId",
ADD COLUMN     "station_parameter_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."station_parameters" DROP COLUMN "parameterId",
DROP COLUMN "stationId",
ADD COLUMN     "parameter_id" TEXT NOT NULL,
ADD COLUMN     "station_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."station_parameters" ADD CONSTRAINT "station_parameters_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."station_parameters" ADD CONSTRAINT "station_parameters_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "public"."parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."measure" ADD CONSTRAINT "measure_station_parameter_id_fkey" FOREIGN KEY ("station_parameter_id") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_station_parameter_id_fkey" FOREIGN KEY ("station_parameter_id") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
