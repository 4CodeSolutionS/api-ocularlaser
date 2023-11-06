import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { AppError } from "@/usecases/errors/app-error";
import { IServiceExecutedFormmated } from "../mappers/list-service-executed-mapper";

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
        const serviceExecuted = await this.serviceExecutedRepository.findById(id) as unknown as IServiceExecutedFormmated

        if(!serviceExecuted){
            throw new AppError('Serviço executado não encontrado', 404);
        }

        // alterar o status do serviceExecuted para aprovado
        await this.serviceExecutedRepository.aproveById(id);

        const templatePathPacient = './views/emails/orientation-before-surgery.hbs.hbs'

        // enviar email para o paciente com as informações da aprovação do exame
        await this.sendMailProvider.sendEmail(
            serviceExecuted.user.email as string,
            serviceExecuted.user.name as string,
            'Orientações Pré Operatórias',
            null,
            templatePathPacient,
            null
        )
        
    }
}