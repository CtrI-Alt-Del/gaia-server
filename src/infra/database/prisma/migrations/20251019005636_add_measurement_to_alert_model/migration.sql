/*
  Warnings:

  - Added the required column `measurement_id` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."alerts" ADD COLUMN     "measurement_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_measurement_id_fkey" FOREIGN KEY ("measurement_id") REFERENCES "public"."measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
