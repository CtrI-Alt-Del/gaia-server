/*
  Warnings:

  - You are about to drop the column `unit` on the `parameters` table. All the data in the column will be lost.
  - Added the required column `number_of_decimal_places` to the `parameters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_of_measure` to the `parameters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."parameters" DROP COLUMN "unit",
ADD COLUMN     "number_of_decimal_places" INTEGER NOT NULL,
ADD COLUMN     "unit_of_measure" TEXT NOT NULL;
