import { PrismaServicesRepository } from "@/repositories/prisma/prisma-services-repository";
import { CreateServiceUseCase } from "@/usecases/services/create/create-services-usecase";

export async function makeCreateService(): Promise<CreateServiceUseCase> {
    const servicesRepository = new PrismaServicesRepository
    const createServiceUseCase = new CreateServiceUseCase(servicesRepository)

    return createServiceUseCase
}