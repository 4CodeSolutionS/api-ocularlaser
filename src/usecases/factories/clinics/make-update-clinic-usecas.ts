import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { UpdateClinicUseCase } from "@/usecases/clinics/update-full/update-clinics-usecase";

export async function makeUpdateClinic(): Promise<UpdateClinicUseCase> {
    const clinicRepository = new PrismaClinicsRepository();
    const updateClinicUseCase = new UpdateClinicUseCase(clinicRepository)

    return updateClinicUseCase
}