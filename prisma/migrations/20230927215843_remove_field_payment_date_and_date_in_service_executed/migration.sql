/*
  Warnings:

  - You are about to drop the column `dataPayment` on the `services_executed` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `services_executed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services_executed" DROP COLUMN "dataPayment",
DROP COLUMN "date";
