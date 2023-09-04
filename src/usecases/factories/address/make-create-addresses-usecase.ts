import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { CreateAddressUseCase } from "@/usecases/address/create/create-addresses-usecase";

export async function makeCreateAddress(): Promise<CreateAddressUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const createAddressUsecase = new CreateAddressUseCase(addressRepository)

    return createAddressUsecase
}