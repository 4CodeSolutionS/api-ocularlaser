import { IUsersRepository } from "@/repositories/interface-users-repository";
import { Address, User } from "@prisma/client";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";

interface IRequestCreateAddress {
    city: string
    complement: string
    neighborhood: string
    num: number
    reference: string
    state: string
    street: string
    zip: string
}
interface IResponseCreateAddress {
    address: Address
}

export class CreateAddressUseCase{
    constructor(
        private addressesRepository: IAddressesRepository,
    ) {}

    async execute({
        city,
        complement,
        neighborhood,
        num,
        reference,
        state,
        street,
        zip
    }:IRequestCreateAddress):Promise<IResponseCreateAddress>{
        // criar address
        const address = await this.addressesRepository.create({
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