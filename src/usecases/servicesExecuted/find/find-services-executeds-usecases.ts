import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Service, ServiceExecuted } from "@prisma/client";

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
  }:IRequestFindServicesExecutedUseCases): Promise<IResponseFindServicesExecutedUseCases> {
    const serviceExecuted = await this.servicesExecutedRepository.findById(id);
    if(!serviceExecuted){
        throw new ResourceNotFoundError()
    }

    const price = await this.servicesExecutedRepository.getterPriceAsNumber(id) as number

    const serviceExecutedResponse: IResponseFindServicesExecutedUseCases = {
        ...serviceExecuted,
        price
    }
    return serviceExecutedResponse
  }
}