import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Service } from '@prisma/client';

interface IResponseFindService {
    services: Service[]
}

export class ListServiceUseCase{
    constructor(
        private servicesRepository: IServiceRepository
    ) {}

    async execute():Promise<IResponseFindService>{
        const services = await this.servicesRepository.list()

        return {
            services
        }
    }
}