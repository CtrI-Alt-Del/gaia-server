-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'MEMBER';
