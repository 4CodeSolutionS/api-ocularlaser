import { Prisma, ServiceExecuted, Status } from "@prisma/client";
import { IServiceExecutedRepository } from "../interface-services-executeds-repository";
import { prisma } from "@/lib/prisma";

export class PrismaServicesExecutedsRepository implements IServiceExecutedRepository {
    async listByPaymentStatus(status: Status, page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            where:{
                payment:{
                    paymentStatus: status
                }

            },
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: {
                    select:{
                        id: true,
                        name: true,
                        address: true,
                    }
                },
                payment: true,
                exams: true,
                price: true,
                approved: true,
            },
            take: 20,
            skip: (page - 1) * 20
        }) as unknown as ServiceExecuted[]

        return servicesExecuted
    }
    async getterPriceAsNumber(id: string){
        const serviceExecuted = await prisma.serviceExecuted.findUnique({
            where: {
                id
            },
            select: {
                price: true
            }
        }) as unknown as ServiceExecuted

        return Number(serviceExecuted.price)
    }

    async create(data: Prisma.ServiceExecutedUncheckedCreateInput){
        const serviceExecuted = await prisma.serviceExecuted.create({
            data,
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: {
                    select:{
                        id: true,
                        name: true,
                        address: true,
                    }
                },
                payment: true,
                exams: true,
                price: true,
                approved: true,
            }
        }) as unknown as ServiceExecuted
        return serviceExecuted
    }

    async list(page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                payment: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                price: true,
                approved: true,
            },
            take: 20,
            skip: (page - 1) * 20
        }) as unknown as ServiceExecuted[]

        return servicesExecuted
    }

    async listByClinicId(idClinic: string, page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            where: {
                idClinic
            },
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                payment: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                price: true,
                approved: true,
            },
            take: 20,
            skip: (page - 1) * 20
        }) as unknown as ServiceExecuted[]

        return servicesExecuted
    }

    async listByUserId(idUser: string, page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            where: {
                idUser
            },
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                payment: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                price: true,
                approved: true,
            },
            take: 20,
            skip: (page - 1) * 20
        }) as unknown as ServiceExecuted[]

        return servicesExecuted
    }

    async listByServiceId(idService: string, page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            where: {
                idService
            },
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                payment: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                price: true,
                approved: true,
            },
            take: 20,
            skip: (page - 1) * 20
        }) as unknown as ServiceExecuted[]

        return servicesExecuted
    }

    async findById(id: string){
        const serviceExecuted = await prisma.serviceExecuted.findUnique({
            where: {
                id
            },
            select:{
                id: true,
                service: true,
                user: {
                    select:{
                        id: true,
                        idCostumerAsaas: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                payment: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                price: true,
                approved: true,
            }
        }) as unknown as ServiceExecuted

        return serviceExecuted
    }

    async deleteById(id: string){
        await prisma.serviceExecuted.delete({
            where: {
                id
            }
        })
    }

    async aproveById(id: string){
        await prisma.serviceExecuted.update({
            where: {
                id
            },
            data: {
                approved: true
            }
        })
    }
}