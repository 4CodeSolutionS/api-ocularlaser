/*
  Warnings:

  - You are about to drop the column `installments` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "installments",
ADD COLUMN     "installmentsCount" DECIMAL(65,30),
ADD COLUMN     "installmentsValue" DECIMAL(65,30);
