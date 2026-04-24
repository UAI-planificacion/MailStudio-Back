-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_updatedBy_fkey";

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "date" TIMESTAMP(3),
ALTER COLUMN "frequency" SET DEFAULT 'ONCE',
ALTER COLUMN "interval" DROP DEFAULT,
ALTER COLUMN "daysOfWeek" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
