import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { ListClinicsUseCase } from "@/usecases/clinics/list/list-clinics-usecase";

export async function makeListClinic(): Promise<ListClinicsUseCase> {
    const clinicRepository = new PrismaClinicsRepository();
    const listClinicsUseCase = new ListClinicsUseCase(clinicRepository)

    return listClinicsUseCase
}