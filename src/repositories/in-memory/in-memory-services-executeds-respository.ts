import { Prisma, ServiceExecuted } from "@prisma/client";
import { IServiceExecutedRepository } from "../interface-services-executeds-repository";
import { randomUUID } from "crypto";
import { InMemoryUsersRepository } from "./in-memory-users-repository";
import { InMemoryServicesRepository } from "./in-memory-services-repository";
import { InMemoryClinicRepository } from "./in-memory-clinics-repository";
import { IServiceExecutedFormmated } from "@/usecases/servicesExecuted/mappers/list-service-executed-mapper";

export class InMemoryServiceExecutedRepository implements IServiceExecutedRepository{
    private servicesExecuted: ServiceExecuted[] = []

    constructor(
        private usersRepository: InMemoryUsersRepository,
        private servicesRepository: InMemoryServicesRepository,
        private clinicsRepository: InMemoryClinicRepository,

    ){
    }
    async getterPriceAsNumber(id: string){
        const serviceExecuted = this.servicesExecuted.find(serviceExecuted => serviceExecuted.id === id)

        if(!serviceExecuted){
            return null
        }

        return Number(serviceExecuted.price)
    }
    
    async create({
        id,
        idService,
        idUser,
        idClinic,
        price,
        approved,
    }: Prisma.ServiceExecutedUncheckedCreateInput){
        const serviceExecuted = {
            id: id ? id : randomUUID(),
            idService,
            idUser,
            idClinic,
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
        const user = await this.usersRepository.findById(serviceExecuted.idUser)

        const service = await this.servicesRepository.findById(serviceExecuted.idService)

        const clinic = await this.clinicsRepository.findById(serviceExecuted.idClinic)

        return {
            ...serviceExecuted,
            user,
            service,
            clinic,
        }
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