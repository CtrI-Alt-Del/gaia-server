/*
  Warnings:

  - You are about to drop the column `parameter_id` on the `alarms` table. All the data in the column will be lost.
  - Added the required column `station_parameter_id` to the `alarms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."alarms" DROP CONSTRAINT "alarms_parameter_id_fkey";

-- AlterTable
ALTER TABLE "public"."alarms" DROP COLUMN "parameter_id",
ADD COLUMN     "station_parameter_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."alarms" ADD CONSTRAINT "alarms_station_parameter_id_fkey" FOREIGN KEY ("station_parameter_id") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
