import { Prisma, ServiceExecuted } from "@prisma/client";
import { IServiceExecutedRepository } from "../interface-services-executeds-repository";
import { prisma } from "@/lib/prisma";

export class PrismaServicesExecutedsRepository implements IServiceExecutedRepository {
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
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: true,
                dataPayment: true,
                date: true,
                price: true,
                approved: true,
            }
        }) as unknown as ServiceExecuted
        return serviceExecuted
    }

    async list(page = 1){
        const servicesExecuted = await prisma.serviceExecuted.findMany({
            select:{
                service: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                dataPayment: true,
                date: true,
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
                service: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                dataPayment: true,
                date: true,
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
                service: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                dataPayment: true,
                date: true,
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
                service: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                dataPayment: true,
                date: true,
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
                service: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        cpf: true,
                        role: true,
                        gender: true,
                    }
                },
                clinic: true,
                exams: {
                    select:{
                        urlExam: true
                    }
                },
                dataPayment: true,
                date: true,
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