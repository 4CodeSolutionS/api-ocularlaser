import { Prisma } from "@prisma/client";
import { IAddressesRepository } from "../interface-addresses-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAddressesRepository implements IAddressesRepository{
    async create(data: Prisma.AddressUncheckedCreateInput){
        const address = await prisma.address.create({data})

        return address;
    }

    async findByClinicId(idClinic: string){
        const address = await prisma.address.findUnique({where: {idClinic}});
        return address;
    }
    
    async updateByClinicId(data: Prisma.AddressUncheckedUpdateInput){
        const address = await prisma.address.update({where: {idClinic: data.idClinic as string}, data})
        
        return address;
    }

    async delete(id: string){
       await prisma.address.delete({where: {id}});
    }

}