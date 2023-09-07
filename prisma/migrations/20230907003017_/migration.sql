/*
  Warnings:

  - You are about to drop the column `idAddress` on the `clinics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idClinic]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idClinic` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clinics" DROP CONSTRAINT "clinics_idAddress_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "idClinic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "idAddress";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_idClinic_key" ON "addresses"("idClinic");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_idClinic_fkey" FOREIGN KEY ("idClinic") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
