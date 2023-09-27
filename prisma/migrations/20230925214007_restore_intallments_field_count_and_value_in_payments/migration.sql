-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "installmentCount" DECIMAL(65,30),
ADD COLUMN     "installmentValue" DECIMAL(65,30);
