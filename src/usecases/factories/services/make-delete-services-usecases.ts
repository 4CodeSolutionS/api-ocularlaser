import { PrismaServicesRepository } from "@/repositories/prisma/prisma-services-repository";
import { DeleteServiceUseCase } from "@/usecases/services/delete/delete-services-usecase";

export async function makeDeleteService(): Promise<DeleteServiceUseCase> {
    const servicesRepository = new PrismaServicesRepository
    const deleteServiceUseCase = new DeleteServiceUseCase(servicesRepository)

    return deleteServiceUseCase
}