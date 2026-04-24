/*
  Warnings:

  - Made the column `content` on table `SendEmailLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `SendEmailLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SendEmailLog" ALTER COLUMN "bcc" DROP DEFAULT,
ALTER COLUMN "cc" DROP DEFAULT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" DROP DEFAULT,
ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "subject" DROP DEFAULT;
