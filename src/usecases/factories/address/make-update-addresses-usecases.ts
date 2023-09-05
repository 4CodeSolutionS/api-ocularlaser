import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { UpdateAddressUseCase } from "@/usecases/address/update-full/update-addresses-usecase";

export async function makeUpdateAddress(): Promise<UpdateAddressUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const updateAddressUseCase = new UpdateAddressUseCase(addressRepository)

    return updateAddressUseCase
}