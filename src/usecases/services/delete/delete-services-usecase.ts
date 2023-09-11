import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

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
            throw new ResourceNotFoundError()
        }

        // deletar um serviço
        await this.servicesRepository.deleteById(id)
    }
}