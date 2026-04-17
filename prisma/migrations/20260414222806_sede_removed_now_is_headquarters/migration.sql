/*
  Warnings:

  - You are about to drop the column `sedeId` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `sedeId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Sede` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `headquarter` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headquarter` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_sedeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_sedeId_fkey";

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "sedeId",
ADD COLUMN     "headquarter" "Headquarters" NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "sedeId",
ADD COLUMN     "headquarter" "Headquarters" NOT NULL;

-- DropTable
DROP TABLE "Sede";
