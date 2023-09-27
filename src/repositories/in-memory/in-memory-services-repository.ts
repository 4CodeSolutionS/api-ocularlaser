import { Prisma, Service, Category } from "@prisma/client";
import { IServiceRepository } from "../interface-services-respository";
import { randomUUID } from "crypto";

export class InMemoryServicesRepository implements IServiceRepository{
    private services: Service[] = [];

    async create({
        id,
        name,
        category,
        price
    }: Prisma.ServiceUncheckedCreateInput){
        const service = {
            id: id ? id : randomUUID(),
            name,
            category: category as Category,
            price: new Prisma.Decimal(price as number)
        }

        this.services.push(service);

        return service;
    }

    async list(){
        return this.services;
    }

    async findById(id: string){
        const service = this.services.find(service => service.id === id);

        if(!service){
            return null
        }

        return service;
    }

    async findByName(name: string){
        const service = this.services.find(service => service.name === name);

        if(!service){
            return null
        }

        return service;
    }

    async updateById({
        id,
        name,
        category,
        price
    }: Prisma.ServiceUncheckedUpdateInput){
        const serviceIndex = this.services.findIndex(service => service.id === id);

        this.services[serviceIndex].name = name as string;
        this.services[serviceIndex].category = category as Category;
        this.services[serviceIndex].price = new Prisma.Decimal(price as number);

        return this.services[serviceIndex];
    }

    async deleteById(id: string){
        const serviceIndex = this.services.findIndex(service => service.id === id);

        this.services.splice(serviceIndex, 1);
    }
}