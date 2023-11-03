/*
  Warnings:

  - You are about to drop the column `clinicId` on the `discount_coupons` table. All the data in the column will be lost.
  - Added the required column `idClinic` to the `discount_coupons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "discount_coupons" DROP CONSTRAINT "discount_coupons_clinicId_fkey";

-- AlterTable
ALTER TABLE "discount_coupons" DROP COLUMN "clinicId",
ADD COLUMN     "idClinic" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "discount_coupons" ADD CONSTRAINT "discount_coupons_idClinic_fkey" FOREIGN KEY ("idClinic") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
