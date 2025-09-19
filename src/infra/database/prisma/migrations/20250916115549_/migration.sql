/*
  Warnings:

  - You are about to drop the `_ParameterToStation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ParameterToStation" DROP CONSTRAINT "_ParameterToStation_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ParameterToStation" DROP CONSTRAINT "_ParameterToStation_B_fkey";

-- DropTable
DROP TABLE "public"."_ParameterToStation";
