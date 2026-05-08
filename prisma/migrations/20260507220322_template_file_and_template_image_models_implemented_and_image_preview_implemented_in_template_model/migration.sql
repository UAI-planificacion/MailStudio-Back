/*
  Warnings:

  - You are about to drop the column `subject` on the `Template` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'PDF', 'HTML', 'TXT', 'VIDEO', 'OTHER');

-- AlterTable
ALTER TABLE "SendEmailLog" ADD COLUMN     "templateFileId" TEXT;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "subject",
ADD COLUMN     "imagePreview" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "TemplateFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL DEFAULT 'PDF',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateImage" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "TemplateImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateFile_name_key" ON "TemplateFile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateImage_templateId_imageId_key" ON "TemplateImage"("templateId", "imageId");

-- AddForeignKey
ALTER TABLE "TemplateFile" ADD CONSTRAINT "TemplateFile_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateFile" ADD CONSTRAINT "TemplateFile_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateImage" ADD CONSTRAINT "TemplateImage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateImage" ADD CONSTRAINT "TemplateImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendEmailLog" ADD CONSTRAINT "SendEmailLog_templateFileId_fkey" FOREIGN KEY ("templateFileId") REFERENCES "TemplateFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
