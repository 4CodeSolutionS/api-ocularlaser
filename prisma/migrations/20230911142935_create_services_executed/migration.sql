-- CreateTable
CREATE TABLE "services_executed" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idService" TEXT NOT NULL,
    "idClinic" TEXT NOT NULL,
    "exams" TEXT[],
    "price" DECIMAL(65,30) NOT NULL,
    "dataPayment" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "services_executed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_executed_id_key" ON "services_executed"("id");

-- AddForeignKey
ALTER TABLE "services_executed" ADD CONSTRAINT "services_executed_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_executed" ADD CONSTRAINT "services_executed_idService_fkey" FOREIGN KEY ("idService") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_executed" ADD CONSTRAINT "services_executed_idClinic_fkey" FOREIGN KEY ("idClinic") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
