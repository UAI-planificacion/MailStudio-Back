-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_templateId_fkey";

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "excelUrl" TEXT,
ADD COLUMN     "filters" JSONB,
ADD COLUMN     "templateFileId" TEXT,
ALTER COLUMN "templateId" DROP NOT NULL,
ALTER COLUMN "students" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_templateFileId_fkey" FOREIGN KEY ("templateFileId") REFERENCES "TemplateFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
