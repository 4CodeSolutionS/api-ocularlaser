import { Address, User } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestDeleteAddress {
    id: string
}

export class DeleteAddressUseCase{
    constructor(
        private addressesRepository: IAddressesRepository,
    ) {}

    async execute({
        id
    }:IRequestDeleteAddress):Promise<void>{
        // encontrar address pelo id
        const findAddressExist = await this.addressesRepository.findById(id)

        // validar se address existe
        if(!findAddressExist){
            throw new ResourceNotFoundError()
        }

        await this.addressesRepository.delete(id)
    }
}