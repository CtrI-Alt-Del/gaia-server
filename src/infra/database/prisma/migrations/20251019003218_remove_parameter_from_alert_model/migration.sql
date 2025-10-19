/*
  Warnings:

  - You are about to drop the column `parameter_id` on the `alerts` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."alarms" DROP CONSTRAINT "alarms_parameter_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."alerts" DROP CONSTRAINT "alerts_parameter_id_fkey";

-- AlterTable
ALTER TABLE "public"."alerts" DROP COLUMN "parameter_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."alarms" ADD CONSTRAINT "alarms_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "public"."station_parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
