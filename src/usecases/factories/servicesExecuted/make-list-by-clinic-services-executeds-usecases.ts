import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { ListServicesExecutedByClinicUseCases } from "@/usecases/servicesExecuted/list-by-clinic/list-by-clinic-services-executeds-usecases";

export async function makeListServiceExecutedByClinic(): Promise<ListServicesExecutedByClinicUseCases> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const clinicsRepository = new PrismaClinicsRepository()
    const listServicesExecutedByClinicUseCases = new ListServicesExecutedByClinicUseCases(
        servicesExecutedRepository,
        clinicsRepository
    )

    return listServicesExecutedByClinicUseCases
}