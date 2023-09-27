/*
  Warnings:

  - You are about to drop the column `installmentsCount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `installmentsValue` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "installmentsCount",
DROP COLUMN "installmentsValue";
