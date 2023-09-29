/*
  Warnings:

  - Added the required column `paymentStatus` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataPayment` to the `services_executed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `services_executed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paymentStatus" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "services_executed" ADD COLUMN     "dataPayment" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
