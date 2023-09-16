import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { ListServicesExecutedUseCases } from "@/usecases/servicesExecuted/list/list-services-executeds-usecases";

export async function makeListServiceExecuted(): Promise<ListServicesExecutedUseCases> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const listServicesExecutedUseCases = new ListServicesExecutedUseCases(
        servicesExecutedRepository
    )

    return listServicesExecutedUseCases
}