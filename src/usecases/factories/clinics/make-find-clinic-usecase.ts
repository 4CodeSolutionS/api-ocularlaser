import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { FindClinicUseCase } from "@/usecases/clinics/find/find-clinics-usecase";

export async function makeFindClinic(): Promise<FindClinicUseCase> {
    const clinicRepository = new PrismaClinicsRepository();
    const findClinicUseCase = new FindClinicUseCase(clinicRepository)

    return findClinicUseCase
}