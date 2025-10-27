/*
  Warnings:

  - Added the required column `code` to the `parameters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."parameters" ADD COLUMN     "code" TEXT NOT NULL;
