-- DropForeignKey
ALTER TABLE "clinics" DROP CONSTRAINT "clinics_idAddress_fkey";

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_idAddress_fkey" FOREIGN KEY ("idAddress") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
