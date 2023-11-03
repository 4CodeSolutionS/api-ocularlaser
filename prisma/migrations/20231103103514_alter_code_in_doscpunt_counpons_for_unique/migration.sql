/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `discount_coupons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "discount_coupons_code_key" ON "discount_coupons"("code");
