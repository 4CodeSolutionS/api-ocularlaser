import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { AproveServiceExecuted } from "@/usecases/servicesExecuted/aprove/aprove-services-executeds-usecase";

export async function makeAproveServiceExecuted(): Promise<AproveServiceExecuted> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const sendMailProvider = new MailProvider()
    const aproveServiceExecuted = new AproveServiceExecuted(
        servicesExecutedRepository,
        sendMailProvider
    )

    return aproveServiceExecuted
}