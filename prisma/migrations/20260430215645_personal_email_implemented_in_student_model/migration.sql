/*
  Warnings:

  - A unique constraint covering the columns `[personalEmail]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Made the column `subject` on table `Workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "personalEmail" TEXT;

-- AlterTable
ALTER TABLE "Workflow" ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "subject" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_personalEmail_key" ON "Student"("personalEmail");
