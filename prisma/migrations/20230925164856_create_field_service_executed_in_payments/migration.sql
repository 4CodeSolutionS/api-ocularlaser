/*
  Warnings:

  - A unique constraint covering the columns `[idServiceExecuted]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idServiceExecuted` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "idServiceExecuted" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_idServiceExecuted_key" ON "payments"("idServiceExecuted");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_idServiceExecuted_fkey" FOREIGN KEY ("idServiceExecuted") REFERENCES "services_executed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
