import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs"
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment"
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { CreatePaymentUseCase } from "@/usecases/payments/create/create-payment-usecases"

export async function makeCreatePayment(): Promise<CreatePaymentUseCase> {
    const usersRepository = new PrismaUsersRepository()
    const dateProvider = new DayjsDateProvider()
    const serviceExecutedRepository = new PrismaServicesExecutedsRepository()
    const asaasProvider = new AsaasProvider()
    const createPaymentUseCase = new CreatePaymentUseCase(
        usersRepository,
        asaasProvider,
        dateProvider,
        serviceExecutedRepository,
        )

    return createPaymentUseCase
}