import { Address } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestUpdateAddress {
    idClinic: string
    city: string
    complement: string 
    neighborhood: string
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
        idClinic,
        city,
        complement,
        neighborhood,
        num,
        reference,
        state,
        street,
        zip
    }:IRequestUpdateAddress):Promise<IResponseUpdateAddress>{
        // encontrar address pelo id
        const findAddressExist = await this.addressesRepository.findByClinicId(idClinic)

        // validar se address existe
        if(!findAddressExist){
            throw new AppError('Endereço não encontrado', 404)
        }

        // atualizar address
        const address = await this.addressesRepository.updateByClinicId({
            idClinic,
            city,
            complement,
            neighborhood,
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