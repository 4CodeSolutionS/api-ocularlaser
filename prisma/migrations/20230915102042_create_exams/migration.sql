/*
  Warnings:

  - You are about to drop the column `exams` on the `services_executed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services_executed" DROP COLUMN "exams";

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "idServiceExecuted" TEXT NOT NULL,
    "urlExam" TEXT NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_id_key" ON "exams"("id");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_idServiceExecuted_fkey" FOREIGN KEY ("idServiceExecuted") REFERENCES "services_executed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
