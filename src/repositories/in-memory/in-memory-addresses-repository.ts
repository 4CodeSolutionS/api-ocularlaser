import { Address, Prisma } from "@prisma/client";
import { IAddressesRepository } from "../interface-addresses-repository";
import { randomUUID } from "crypto";

export class InMemoryAddressesRepository implements IAddressesRepository{
    private addresses: Address[] = [];

    async create({
        id,
        idClinic,
        street,
        city,
        complement,
        neighborhood,
        num,
        reference,
        state,
        zip
    }: Prisma.AddressUncheckedCreateInput){
        const address = {
            id: id ? id : randomUUID(),
            idClinic: idClinic ? idClinic : null,
            street,
            city,
            complement,
            neighborhood,
            num: new Prisma.Decimal(num as number),
            reference,
            state,
            zip
        }

        this.addresses.push(address);

        return address 

    }

    async findByClinicId(idClinic: string){
        const address = this.addresses.find(address => address.idClinic === idClinic);

        if(!address){
            return null
        }

        return address;
    }

    async updateByClinicId({
        id,
        idClinic,
        street,
        city,
        complement,
        neighborhood,
        num,
        reference,
        state,
        zip   
    }: Prisma.AddressUncheckedUpdateInput){
        const address = this.addresses.findIndex(address => address.idClinic === idClinic);

        this.addresses[address].city = city as string
        this.addresses[address].complement = complement as string
        this.addresses[address].neighborhood = neighborhood as string
        this.addresses[address].num = new Prisma.Decimal(num as number)
        this.addresses[address].reference = reference as string
        this.addresses[address].state = state as string
        this.addresses[address].street = street as string
        this.addresses[address].zip = zip as string

        return this.addresses[address]
        
    }

    async delete(id: string){
        const address = this.addresses.findIndex(address => address.id === id);

        this.addresses.splice(address, 1)
    }

}