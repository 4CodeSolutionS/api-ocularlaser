import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { CreateClinicUseCase } from "@/usecases/clinics/create/create-clinics-usecase";

export async function makeCreateClinic(): Promise<CreateClinicUseCase> {
    const clinicRepository = new PrismaClinicsRepository();
    const createClinicUseCase = new CreateClinicUseCase(clinicRepository)

    return createClinicUseCase
}