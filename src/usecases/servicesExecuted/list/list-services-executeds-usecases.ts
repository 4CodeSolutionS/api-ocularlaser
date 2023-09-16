import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { ServiceExecuted } from "@prisma/client";

interface IRequestListServicesExecutedUseCases{
    page?: number;
}

interface IResponseListServicesExecutedUseCases{
    servicesExecuteds: ServiceExecuted[]
}


export class ListServicesExecutedUseCases {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
  ) {}

  async execute({
    page
  }:IRequestListServicesExecutedUseCases): Promise<IResponseListServicesExecutedUseCases> {
    const servicesExecuteds = await this.servicesExecutedRepository.list(page);

    return { servicesExecuteds };
  }
}