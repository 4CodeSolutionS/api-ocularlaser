import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IServiceExecutedFormmated, ListServiceExecutedMapper } from "../mappers/list-service-executed-mapper";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestListServicesExecutedUseCases{
    idClinic: string;
    page?: number;
}

export class ListServicesExecutedByClinicUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
        private clinicsRepository: IClinicsRepository
  ) {}

  async execute({
    idClinic,
    page
  }:IRequestListServicesExecutedUseCases): Promise<IServiceExecutedFormmated[]> {
    // buscar clinica pelo id
    const findClinicExists = await this.clinicsRepository.findById(idClinic)

    // validar se clinica existe pelo id
    if(!findClinicExists){
        throw new AppError('Clinica não encontrada', 404)
    }

    const servicesExecuteds = await this.servicesExecutedRepository.listByClinicId(idClinic, page);

    const servicesExecutedsFormatted = await ListServiceExecutedMapper(servicesExecuteds)

    return servicesExecutedsFormatted
  }
}