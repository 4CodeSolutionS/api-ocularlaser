/*
  Warnings:

  - Added the required column `invoiceUrl` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "invoiceUrl" TEXT NOT NULL;
