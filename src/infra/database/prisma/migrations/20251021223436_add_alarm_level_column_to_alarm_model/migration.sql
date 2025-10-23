/*
  Warnings:

  - Changed the type of `level` on the `alarms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."alarms" DROP COLUMN "level",
ADD COLUMN     "level" "public"."AlertLevel" NOT NULL;
