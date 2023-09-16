import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestAproveServiceExecuted{
    id: string
}

export class AproveServiceExecuted{
    constructor(
        private serviceExecutedRepository: IServiceExecutedRepository,
        private sendMailProvider: IMailProvider,
    ){}

    async execute({
        id
    }:IRequestAproveServiceExecuted){
        const serviceExecuted = await this.serviceExecutedRepository.findById(id);

        if(!serviceExecuted){
            throw new ResourceNotFoundError()
        }

        // alterar o status do serviceExecuted para aprovado
        await this.serviceExecutedRepository.aproveById(id);

        // enviar email para o equipe administrativa da clinica
        // ...pedir templates para enviar emails para o equipe administrativa da clinica
    }
}