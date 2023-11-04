import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { Service } from '@prisma/client';
import { AppError } from '@/usecases/errors/app-error';

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
            throw new AppError('Serviço não encontrado', 404)
        }

        // retornar service
        return {
            service: findServiceExists
        }
    }
}