import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { FindServicesExecutedUseCases } from "@/usecases/servicesExecuted/find/find-services-executeds-usecases";

export async function makeFindServiceExecuted(): Promise<FindServicesExecutedUseCases> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const findServicesExecutedUseCases = new FindServicesExecutedUseCases(
        servicesExecutedRepository
    )

    return findServicesExecutedUseCases
}