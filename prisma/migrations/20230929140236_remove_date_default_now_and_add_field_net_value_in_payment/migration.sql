/*
  Warnings:

  - Added the required column `netValue` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "netValue" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "datePayment" DROP DEFAULT;
