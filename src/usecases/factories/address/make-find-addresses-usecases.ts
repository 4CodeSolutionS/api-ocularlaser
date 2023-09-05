import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { FindAddressUseCase } from "@/usecases/address/find/find-address-usecase";

export async function makeFindAddress(): Promise<FindAddressUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const findAddressUseCase = new FindAddressUseCase(addressRepository)

    return findAddressUseCase
}