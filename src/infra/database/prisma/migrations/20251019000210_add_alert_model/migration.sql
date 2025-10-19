-- CreateEnum
CREATE TYPE "public"."AlertLevel" AS ENUM ('WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" TEXT NOT NULL,
    "alarm_id" TEXT NOT NULL,
    "parameter_id" TEXT NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_alarm_id_fkey" FOREIGN KEY ("alarm_id") REFERENCES "public"."alarms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "public"."parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
