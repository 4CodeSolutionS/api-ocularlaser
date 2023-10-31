-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idAddress" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "cvc" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_id_key" ON "cards"("id");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_idAddress_fkey" FOREIGN KEY ("idAddress") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
