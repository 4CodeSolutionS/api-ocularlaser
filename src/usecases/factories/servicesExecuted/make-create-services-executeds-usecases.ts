import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { PrismaServicesRepository } from "@/repositories/prisma/prisma-services-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateServiceExecutedUseCase } from "@/usecases/servicesExecuted/create/create-services-executeds-usecases";

export async function makeCreateServiceExecuted(): Promise<CreateServiceExecutedUseCase> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const clinicsRepository = new PrismaClinicsRepository()
    const usersRepository = new PrismaUsersRepository()
    const servicesRepository = new PrismaServicesRepository()
    const sendMailProvider = new MailProvider()
    const createServiceExecutedUseCase = new CreateServiceExecutedUseCase(
        servicesExecutedRepository,
        sendMailProvider,
        usersRepository,
        servicesRepository,
        clinicsRepository
    )

    return createServiceExecutedUseCase
}