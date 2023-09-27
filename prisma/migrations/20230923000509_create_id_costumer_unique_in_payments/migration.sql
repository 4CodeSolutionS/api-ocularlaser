/*
  Warnings:

  - A unique constraint covering the columns `[idCostumer]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "idCostumer" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_idCostumer_key" ON "payments"("idCostumer");
