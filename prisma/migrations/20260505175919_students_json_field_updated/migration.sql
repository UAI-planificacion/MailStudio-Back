/*
  Warnings:

  - You are about to drop the column `lastSequenceNumber` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `studentEmails` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `students` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "lastSequenceNumber",
DROP COLUMN "studentEmails",
ADD COLUMN     "students" JSONB NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL;
