import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ServiceExecuted } from "@prisma/client";

interface IRequestListServicesExecutedUseCases{
    idClinic: string;
    page?: number;
}

interface IResponseListServicesExecutedUseCases{
    servicesExecuteds: ServiceExecuted[]
}


export class ListServicesExecutedByClinicUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
        private clinicsRepository: IClinicsRepository
  ) {}

  async execute({
    idClinic,
    page
  }:IRequestListServicesExecutedUseCases): Promise<IResponseListServicesExecutedUseCases> {
    // buscar clinica pelo id
    const findClinicExists = await this.clinicsRepository.findById(idClinic)

    // validar se clinica existe pelo id
    if(!findClinicExists){
        throw new ResourceNotFoundError()
    }

    const servicesExecuteds = await this.servicesExecutedRepository.listByClinicId(idClinic, page);

    return { servicesExecuteds };
  }
}