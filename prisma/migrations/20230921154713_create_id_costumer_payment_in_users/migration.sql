/*
  Warnings:

  - A unique constraint covering the columns `[idCostumerPayment]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "idCostumerPayment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_idCostumerPayment_key" ON "users"("idCostumerPayment");
