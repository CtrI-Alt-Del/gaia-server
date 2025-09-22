/*
  Warnings:

  - You are about to drop the column `code` on the `stations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid]` on the table `stations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `stations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."stations_code_key";

-- AlterTable
ALTER TABLE "public"."stations" DROP COLUMN "code",
ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stations_uid_key" ON "public"."stations"("uid");
