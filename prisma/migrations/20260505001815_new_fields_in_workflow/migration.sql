-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "lastDayOfMonth" BOOLEAN DEFAULT false,
ADD COLUMN     "neverEnds" BOOLEAN DEFAULT false,
ADD COLUMN     "occurrences" INTEGER,
ADD COLUMN     "repeatUntil" TIMESTAMP(3);
