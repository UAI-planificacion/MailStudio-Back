-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NORMAL', 'HIGH');

-- AlterTable
ALTER TABLE "SendEmailLog" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NORMAL';
