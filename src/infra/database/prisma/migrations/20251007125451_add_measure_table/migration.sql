-- CreateTable
CREATE TABLE "public"."Measure" (
    "id" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,
    "unit_of_measure" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);
