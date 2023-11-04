import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { AppError } from '@/usecases/errors/app-error';

interface IRequestDeleteService {
    id: string
}

export class DeleteServiceUseCase{
    constructor(
        private servicesRepository: IServiceRepository
    ) {}

    async execute({
        id
    }:IRequestDeleteService):Promise<void>{
        // buscar se existe uma service com o mesmo nome
        const findServiceExists = await this.servicesRepository.findById(id)

        // validar se existe uma service
        if(!findServiceExists){
            throw new AppError('Serviço não encontrado', 404)
        }

        // deletar um serviço
        await this.servicesRepository.deleteById(id)
    }
}