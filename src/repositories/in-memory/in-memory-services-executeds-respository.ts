import { Prisma, ServiceExecuted } from "@prisma/client";
import { IServiceExecutedRepository } from "../interface-services-executeds-repository";
import { randomUUID } from "crypto";

export class InMemoryServiceExecutedRepository implements IServiceExecutedRepository{
    async getterPriceAsNumber(id: string){
        const serviceExecuted = this.servicesExecuted.find(serviceExecuted => serviceExecuted.id === id)

        if(!serviceExecuted){
            return null
        }

        return Number(serviceExecuted.price)
    }
    private servicesExecuted: ServiceExecuted[] = []
    
    async create({
        id,
        idService,
        idUser,
        idClinic,
        date,
        dataPayment,
        price,
        approved,
    }: Prisma.ServiceExecutedUncheckedCreateInput){
        const serviceExecuted = {
            id: id ? id : randomUUID(),
            idService,
            idUser,
            idClinic,
            date: new Date(date),
            dataPayment: new Date(dataPayment),
            price: new Prisma.Decimal(price as number),
            approved: approved ? approved : false,
        }

        this.servicesExecuted.push(serviceExecuted)

        return serviceExecuted
    }

    async list(page = 1){
        return this.servicesExecuted.slice((page - 1) * 20, page * 20)
    }

    async listByClinicId(idClinic: string, page = 1){
        const servicesExecuted = this.servicesExecuted
        .filter(serviceExecuted => serviceExecuted.idClinic === idClinic)
        .slice((page - 1) * 20, page * 20)

        return servicesExecuted
    }

    async listByUserId(idUser: string, page = 1){
        const servicesExecuted = this.servicesExecuted
        .filter(serviceExecuted => serviceExecuted.idUser === idUser)
        .slice((page - 1) * 20, page * 20)

        return servicesExecuted
    }
    
    async listByServiceId(idService: string, page = 1){
        const servicesExecuted = this.servicesExecuted
        .filter(serviceExecuted => serviceExecuted.idService === idService)
        .slice((page - 1) * 20, page * 20)

        return servicesExecuted
    }

    async findById(id: string){
        const serviceExecuted = this.servicesExecuted.find(serviceExecuted => serviceExecuted.id === id)

        if(!serviceExecuted){
            return null
        }

        return serviceExecuted
    }

    async deleteById(id: string){
        const serviceExecutedIndex = this.servicesExecuted.findIndex(serviceExecuted => serviceExecuted.id === id)

        this.servicesExecuted.splice(serviceExecutedIndex, 1)
    }

    async aproveById(id: string){
        const serviceExecutedIndex = this.servicesExecuted.findIndex(serviceExecuted => serviceExecuted.id === id)

        this.servicesExecuted[serviceExecutedIndex].approved = true
    }
}