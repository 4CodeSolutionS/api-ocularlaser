/*
  Warnings:

  - You are about to drop the column `idCostumerPayment` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idCostumerAsaas]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_idCostumerPayment_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "idCostumerPayment",
ADD COLUMN     "idCostumerAsaas" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_idCostumerAsaas_key" ON "users"("idCostumerAsaas");
