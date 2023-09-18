import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ServiceExecuted } from "@prisma/client";
import { IServiceExecutedFormmated, ListServiceExecutedMapper } from "../mappers/list-service-executed-mapper";

interface IRequestListServicesExecutedUseCases{
    idUser: string;
    page?: number;
}

interface IResponseListServicesExecutedUseCases{
    servicesExecuteds: ServiceExecuted[]
}


export class ListServicesExecutedByUserUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
        private usersRepository: IUsersRepository
  ) {}

  async execute({
    idUser,
    page
  }:IRequestListServicesExecutedUseCases): Promise<IServiceExecutedFormmated[]> {
    // encontrar usuario pelo id
    const findUserExist = await this.usersRepository.getUserSecurity(idUser)

    // validar se usuario existe pelo id
    if(!findUserExist){
        throw new ResourceNotFoundError()
}
    const servicesExecuteds = await this.servicesExecutedRepository.listByUserId(idUser, page);

    const servicesExecutedsFormatted = await ListServiceExecutedMapper(servicesExecuteds)

    return servicesExecutedsFormatted
  }
}