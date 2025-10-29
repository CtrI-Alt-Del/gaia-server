/*
  Warnings:

  - You are about to drop the column `last_reading_at` on the `stations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."stations" DROP COLUMN "last_reading_at",
ADD COLUMN     "last_read_at" TIMESTAMP(3);
