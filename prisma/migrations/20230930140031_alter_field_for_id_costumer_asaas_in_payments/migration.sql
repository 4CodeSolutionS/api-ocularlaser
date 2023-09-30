/*
  Warnings:

  - You are about to drop the column `idCostumer` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "idCostumer",
ADD COLUMN     "idCostumerAsaas" TEXT;
