import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { AppError } from "@/usecases/errors/app-error";
import { ServiceExecuted } from "@prisma/client";

interface IRequestFindServicesExecutedUseCases {
    id: string;
}

interface IResponseFindServicesExecutedUseCases{
    id: string;
    idUser: string;
    idService: string;
    idClinic: string;
    price: number;
    dataPayment: Date;
    date: Date;
    approved: boolean;
}

export class FindServicesExecutedUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
  ) {}

  async execute({
    id
  }:IRequestFindServicesExecutedUseCases): Promise<ServiceExecuted> {
    const serviceExecuted = await this.servicesExecutedRepository.findById(id);
    if(!serviceExecuted){
        throw new AppError('Serviço executado não encontrado', 404);
    }

    const price = await this.servicesExecutedRepository.getterPriceAsNumber(id) as number

    const serviceExecutedResponse = {
        ...serviceExecuted,
        price
    } as unknown as ServiceExecuted
    
    return serviceExecutedResponse
  }
}