-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER';

-- CreateTable
CREATE TABLE "keys" (
    "id" TEXT NOT NULL,
    "idUser" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keys_id_key" ON "keys"("id");

-- CreateIndex
CREATE UNIQUE INDEX "keys_idUser_key" ON "keys"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "keys_key_key" ON "keys"("key");
