-- DropForeignKey
ALTER TABLE "SendEmailLog" DROP CONSTRAINT "SendEmailLog_templateId_fkey";

-- AlterTable
ALTER TABLE "SendEmailLog" ADD COLUMN     "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "content" JSONB DEFAULT '{}',
ADD COLUMN     "subject" TEXT DEFAULT '',
ALTER COLUMN "templateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "subject" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "bcc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cc" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "subject" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "SendEmailLog" ADD CONSTRAINT "SendEmailLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
