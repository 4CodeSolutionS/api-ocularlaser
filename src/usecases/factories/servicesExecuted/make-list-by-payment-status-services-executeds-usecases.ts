import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository";
import { ListServiceExecutedByPaymentStatusUseCase } from "@/usecases/servicesExecuted/list-by-payment-status/list-by-payment-status-services-executeds-usecase";

export async function makeListServiceExecutedByPaymentStatus(): Promise<ListServiceExecutedByPaymentStatusUseCase> {
    const servicesExecutedRepository = new PrismaServicesExecutedsRepository()
    const listServiceExecutedByPaymentStatusUseCase = new ListServiceExecutedByPaymentStatusUseCase(
        servicesExecutedRepository,
    )

    return listServiceExecutedByPaymentStatusUseCase
}