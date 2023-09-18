import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IServiceExecutedFormmated, ListServiceExecutedMapper } from "../mappers/list-service-executed-mapper";

interface IRequestListServicesExecutedUseCases{
    page?: number;
}

export class ListServicesExecutedUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
  ) {}

  async execute({
    page
  }:IRequestListServicesExecutedUseCases): Promise<IServiceExecutedFormmated[]> {
    const servicesExecuteds = await this.servicesExecutedRepository.list(page);

    const servicesExecutedsFormatted = await ListServiceExecutedMapper(servicesExecuteds)

    return servicesExecutedsFormatted
  }
}