import { PrismaServicesRepository } from "@/repositories/prisma/prisma-services-repository";
import { ListServiceUseCase } from "@/usecases/services/list/list-services-usecase";

export async function makeListServices(): Promise<ListServiceUseCase> {
    const servicesRepository = new PrismaServicesRepository
    const listServiceUseCase = new ListServiceUseCase(servicesRepository)

    return listServiceUseCase
}