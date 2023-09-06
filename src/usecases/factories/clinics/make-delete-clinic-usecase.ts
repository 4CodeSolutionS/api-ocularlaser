import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { DeleteClinicUseCase } from "@/usecases/clinics/delete/delete-clinics-usecase";

export async function makeDeleteClinic(): Promise<DeleteClinicUseCase> {
    const clinicRepository = new PrismaClinicsRepository();
    const deleteClinicUseCase = new DeleteClinicUseCase(clinicRepository)

    return deleteClinicUseCase
}