import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment"
import { PrismaCardRepository } from "@/repositories/prisma/prisma-cards-repository"
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository"
import { EventsWebHookPaymentsUseCases } from "@/usecases/payments/events-webhook/events-webhook-payments-usecases"

export async function makeReceiveEventsPaymentsWebHook(): Promise<EventsWebHookPaymentsUseCases> {
    const paymentsRepository = new PrismaPaymentRepository()
    const serviceExecutedRepository = new PrismaServicesExecutedsRepository()
    const asaasProvider = new AsaasProvider()
    const mailProvider = new MailProvider()
    const cardRepository = new PrismaCardRepository()
    const eventsmPaymentWebhookUseCase = new EventsWebHookPaymentsUseCases(
        paymentsRepository,
        serviceExecutedRepository,
        asaasProvider,
        cardRepository,
        mailProvider,
        )

    return eventsmPaymentWebhookUseCase
}