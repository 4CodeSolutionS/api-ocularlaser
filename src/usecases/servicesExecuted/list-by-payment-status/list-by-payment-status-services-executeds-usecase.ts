import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IServiceExecutedFormmated, ListServiceExecutedMapper } from "../mappers/list-service-executed-mapper";
import { Status } from "@prisma/client";

interface IRequestListServicesExecutedUseCases{
    status: Status;
    page?: number;
}

export class ListServiceExecutedByPaymentStatusUseCase {
  constructor(
        private servicesExecutedRepository: IServiceExecutedRepository,
  ) {}

  async execute({
    status,
    page
  }:IRequestListServicesExecutedUseCases): Promise<IServiceExecutedFormmated[]> {
    const servicesExecuteds = await this.servicesExecutedRepository.listByPaymentStatus(status, page);
    const servicesExecutedsFormatted = await ListServiceExecutedMapper(servicesExecuteds)

    return servicesExecutedsFormatted
  }
}