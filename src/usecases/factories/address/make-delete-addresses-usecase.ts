import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { DeleteAddressUseCase } from "@/usecases/address/delete/delete-address-usecase";

export async function makeDeleteAddress(): Promise<DeleteAddressUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const deleteAddressUseCase = new DeleteAddressUseCase(addressRepository)

    return deleteAddressUseCase
}