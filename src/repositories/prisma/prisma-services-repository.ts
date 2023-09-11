import { Prisma, $Enums } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IServiceRepository } from "../interface-services-respository";
import { prisma } from "@/lib/prisma";

export class PrismaServicesRepository implements IServiceRepository{
    async create(data: Prisma.ServiceUncheckedCreateInput){
        const service = await prisma.service.create({data})

        return service;
    }

    async list(){
        const services = await prisma.service.findMany();

        return services;
    }

    async findById(id: string){
        const service = await prisma.service.findUnique({
            where: {id}
        })

        return service;
    }

    async findByName(name: string){
        const service = await prisma.service.findUnique({
            where: {name}
        })

        return service;
    }

    async updateById(data: Prisma.ServiceUncheckedUpdateInput){
        const service = await prisma.service.update({
            where: {id: data.id as string},
            data
        })
        return service;
    }

    async deleteById(id: string){
        await prisma.service.delete({
            where: {id}
        })
    }
}