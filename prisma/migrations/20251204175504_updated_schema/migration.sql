-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanVersion" DROP CONSTRAINT "PlanVersion_id_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE "PlanVersion" ADD COLUMN     "planId" INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanVersion" ADD CONSTRAINT "PlanVersion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
