/*
  Warnings:

  - A unique constraint covering the columns `[idUser]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cards_idUser_key" ON "cards"("idUser");
