/*
  Warnings:

  - You are about to drop the column `cvc` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `idAddress` on the `cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_idAddress_fkey";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "cvc",
DROP COLUMN "idAddress";
