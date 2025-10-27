/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `parameters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parameters_code_key" ON "public"."parameters"("code");
