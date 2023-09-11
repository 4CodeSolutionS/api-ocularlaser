import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Service } from '@prisma/client';

interface IRequestFindService {
    id: string
}

interface IResponseFindService {
    service: Service
}

export class FindServiceUseCase{
    constructor(
        private servicesRepository: IServiceRepository
    ) {}

    async execute({
        id
    }:IRequestFindService):Promise<IResponseFindService>{
        // buscar se existe uma service pelo id
        const findServiceExists = await this.servicesRepository.findById(id)

        // validar se existe uma service
        if(!findServiceExists){
            throw new ResourceNotFoundError()
        }

        // retornar service
        return {
            service: findServiceExists
        }
    }
}