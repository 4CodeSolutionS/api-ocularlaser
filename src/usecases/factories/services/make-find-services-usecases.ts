import { PrismaServicesRepository } from "@/repositories/prisma/prisma-services-repository";
import { CreateServiceUseCase } from "@/usecases/services/create/create-services-usecase";
import { FindServiceUseCase } from "@/usecases/services/find/find-services-usecase";

export async function makeFindService(): Promise<FindServiceUseCase> {
    const servicesRepository = new PrismaServicesRepository
    const findServiceUseCase = new FindServiceUseCase(servicesRepository)

    return findServiceUseCase
}