/*
  Warnings:

  - A unique constraint covering the columns `[tokenCardAsaas]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "tokenCardAsaas" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cards_tokenCardAsaas_key" ON "cards"("tokenCardAsaas");
