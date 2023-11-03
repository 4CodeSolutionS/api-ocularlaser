import { Clinic, Prisma } from "@prisma/client";
import { IClinicsRepository } from "../interface-clinics-repository";
import { prisma } from "@/lib/prisma";

export class PrismaClinicsRepository implements IClinicsRepository{
    async create(data: Prisma.ClinicUncheckedCreateInput){
        const clinic = await prisma.clinic.create({
            data,
            select:{
                id: true,
                name: true,
                address: true,
            }
        }) as unknown as Clinic

        return clinic
    }

    async list(){
        return await prisma.clinic.findMany({
            select:{
                id: true,
                name: true,
                address: true,
                discountCoupons: true,
            }
        }) as unknown as Clinic[]
    }

    async findById(id: string){
        const clinic = await prisma.clinic.findUnique({
            where:{id},
            select:{
                id: true,
                name: true,
                address: true,
                discountCoupons: true,
            }
        }) as unknown as Clinic

        return clinic
    }

    async findByName(name: string){
        const clinic = await prisma.clinic.findUnique({where:{name}})

        return clinic
    }

    async updateById(data: Prisma.ClinicUncheckedUpdateInput){
        const clinic = await prisma.clinic.update({
            where:{id:data.id as string},
            data,
            select:{
                id: true,
                name: true,
                address: true,
            }
        }) as unknown as Clinic

        return clinic
    }
    
    async deleteById(id: string) {
        await prisma.clinic.delete({
            where:{id},
        })
    }
}