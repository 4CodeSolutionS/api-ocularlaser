import { Category, Service } from "@prisma/client";
import 'dotenv/config'
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { ServiceAlreadyExistsError } from "@/usecases/errors/service-already-exists-error";

interface IRequestCreateService {
    name: string
    price: number
    category: Category
}

interface IResponseCreateService {
    service: Service
}

export class CreateServiceUseCase{
    constructor(
        private servicesRepository: IServiceRepository
    ) {}

    async execute({
        name,
        price,
        category
    }:IRequestCreateService):Promise<IResponseCreateService>{
        // buscar se existe uma service com o mesmo nome
        const serviceAlreadyExists = await this.servicesRepository.findByName(name)

        // validar se existe uma service com o mesmo nome
        if(serviceAlreadyExists){
            throw new ServiceAlreadyExistsError()
        }

        //criar a service
        const service = await this.servicesRepository.create({
           name,
           price,
           category
        })

        //retornar a service
        return {
            service
        }
    }
}