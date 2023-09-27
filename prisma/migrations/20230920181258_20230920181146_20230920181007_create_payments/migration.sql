-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'FETLOCK', 'PIX');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REPROVED');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "Status" NOT NULL,
    "installments" DECIMAL(65,30) NOT NULL,
    "datePayment" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
