import { Address, User } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestFindAddress {
    idClinic: string
}

interface IResponseFindAddress {
    address: Address
}

export class FindAddressUseCase{
    constructor(
        private addressesRepository: IAddressesRepository,
    ) {}

    async execute({
        idClinic
    }:IRequestFindAddress):Promise<IResponseFindAddress>{
        // encontrar address pelo id
        const findAddressExist = await this.addressesRepository.findByClinicId(idClinic)

        // validar se address existe
        if(!findAddressExist){
            throw new AppError('Endereço não encontrado', 404)
        }

        // retornar address
        return {
            address: findAddressExist
        }
    }
}