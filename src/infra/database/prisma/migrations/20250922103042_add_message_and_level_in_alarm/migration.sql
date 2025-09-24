/*
  Warnings:

  - Added the required column `level` to the `alarms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `alarms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."alarms" ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL;
