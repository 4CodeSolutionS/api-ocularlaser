import { Address } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestUpdateAddress {
    id: string
    city: string
    complement: string 
    negihborhood: string
    num: number
    reference: string
    state: string
    street: string
    zip: string
}
interface IResponseUpdateAddress {
    address: Address
}

export class UpdateAddressUseCase{
    constructor(
        private addressesRepository: IAddressesRepository,
    ) {}

    async execute({
        id,
        city,
        complement,
        negihborhood,
        num,
        reference,
        state,
        street,
        zip
    }:IRequestUpdateAddress):Promise<IResponseUpdateAddress>{
        // encontrar address pelo id
        const findAddressExist = await this.addressesRepository.findById(id)

        // validar se address existe
        if(!findAddressExist){
            throw new ResourceNotFoundError()
        }

        // atualizar address
        const address = await this.addressesRepository.update({
            id,
            city,
            complement,
            negihborhood,
            num,
            reference,
            state,
            street,
            zip
        })

        // retornar address
        return {
            address
        }
    }
}