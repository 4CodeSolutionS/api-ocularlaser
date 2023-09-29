/*
  Warnings:

  - Added the required column `idPaymentAsaas` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "idPaymentAsaas" TEXT NOT NULL;
