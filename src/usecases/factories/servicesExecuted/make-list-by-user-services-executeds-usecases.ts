import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ListServicesExecutedByUserUseCases } from "@/usecases/servicesExecuted/list-by-user/list-by-user-services-executeds-usecases";

export async function makeListServiceExecutedByUser(): Promise<ListServicesExecutedByUserUseCases> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const usersRepository = new PrismaUsersRepository()
    const listServicesExecutedByUserUseCases = new ListServicesExecutedByUserUseCases(
        servicesExecutedRepository,
        usersRepository
    )

    return listServicesExecutedByUserUseCases
}