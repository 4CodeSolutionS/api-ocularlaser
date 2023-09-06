import { Address, User } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestFindAddress {
    id: string
}

interface IResponseFindAddress {
    address: Address
}

export class FindAddressUseCase{
    constructor(
        private addressesRepository: IAddressesRepository,
    ) {}

    async execute({
        id
    }:IRequestFindAddress):Promise<IResponseFindAddress>{
        // encontrar address pelo id
        const findAddressExist = await this.addressesRepository.findById(id)

        // validar se address existe
        if(!findAddressExist){
            throw new ResourceNotFoundError()
        }

        // retornar address
        return {
            address: findAddressExist
        }
    }
}