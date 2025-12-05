/*
  Warnings:

  - You are about to drop the column `planId` on the `PlanVersion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlanVersion" DROP CONSTRAINT "PlanVersion_planId_fkey";

-- AlterTable
ALTER TABLE "PlanVersion" DROP COLUMN "planId";

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanVersion" ADD CONSTRAINT "PlanVersion_id_fkey" FOREIGN KEY ("id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
