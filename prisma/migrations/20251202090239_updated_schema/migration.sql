/*
  Warnings:

  - Added the required column `endDate` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `PlanVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `PlanVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlanVersion" ADD COLUMN     "amount" BIGINT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
