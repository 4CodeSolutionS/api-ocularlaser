import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment"
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { ConfirmPaymentReceivedUseCase } from "@/usecases/payments/confirm-payment/confirmn-payment-usecases"

export async function makeReceiveEventsPaymentsWebHook(): Promise<ConfirmPaymentReceivedUseCase> {
    const paymentsRepository = new PrismaPaymentRepository()
    const serviceExecutedRepository = new PrismaServicesExecutedsRepository()
    const asaasProvider = new AsaasProvider()
    const mailProvider = new MailProvider()
    const confirmPaymentReceivedUseCase = new ConfirmPaymentReceivedUseCase(
        paymentsRepository,
        serviceExecutedRepository,
        asaasProvider,
        mailProvider
        )

    return confirmPaymentReceivedUseCase
}