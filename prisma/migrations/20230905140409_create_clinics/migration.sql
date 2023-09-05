-- AlterTable
ALTER TABLE "users" ADD COLUMN     "idClinic" TEXT;

-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idAddress" TEXT NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinics_id_key" ON "clinics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_name_key" ON "clinics"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_idClinic_fkey" FOREIGN KEY ("idClinic") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_idAddress_fkey" FOREIGN KEY ("idAddress") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
