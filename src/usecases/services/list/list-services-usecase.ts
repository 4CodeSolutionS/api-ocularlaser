import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { Service } from '@prisma/client';

export class ListServiceUseCase{
    constructor(
        private servicesRepository: IServiceRepository
    ) {}

    async execute():Promise<Service[]>{
        const services = await this.servicesRepository.list()

        return services
    }
}