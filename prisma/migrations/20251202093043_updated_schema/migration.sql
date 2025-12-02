/*
  Warnings:

  - You are about to drop the column `amount` on the `PlanVersion` table. All the data in the column will be lost.
  - You are about to drop the column `years` on the `PlanVersion` table. All the data in the column will be lost.
  - Added the required column `lastPlanVersionId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "lastPlanVersionId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlanVersion" DROP COLUMN "amount",
DROP COLUMN "years";
