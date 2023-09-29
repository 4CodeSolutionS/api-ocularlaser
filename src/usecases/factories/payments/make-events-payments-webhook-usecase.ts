import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment"
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { EventsWebHookPaymentsUseCases } from "@/usecases/payments/events-webhook/events-webhook-payments-usecases"

export async function makeReceiveEventsPaymentsWebHook(): Promise<EventsWebHookPaymentsUseCases> {
    const paymentsRepository = new PrismaPaymentRepository()
    const serviceExecutedRepository = new PrismaServicesExecutedsRepository()
    const asaasProvider = new AsaasProvider()
    const mailProvider = new MailProvider()
    const eventsmPaymentWebhookUseCase = new EventsWebHookPaymentsUseCases(
        paymentsRepository,
        serviceExecutedRepository,
        asaasProvider,
        mailProvider
        )

    return eventsmPaymentWebhookUseCase
}