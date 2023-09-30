import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IServiceRepository } from "@/repositories/interface-services-respository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Payment, ServiceExecuted } from "@prisma/client";

export interface IServiceExecuted{
    name: string;
    email: string
    service: string;
    clinic: string;
    price: number;
    exams?: string[];
    serviceMessage: string;
}

interface IRequestServiceExecuted{
    idUser: string
    idService: string
    idClinic: string
}

interface IResponseServiceExecuted{
    id: string;
    idUser: string;
    idService: string;
    idClinic: string;
    price: number;
    approved: boolean;
}

export class CreateServiceExecutedUseCase{
    constructor(
        private serviceExecutedRepository: IServiceExecutedRepository,
        private sendMailProvider: IMailProvider,
        private usersRepository: IUsersRepository,
        private servicesRepository: IServiceRepository,
        private clinicsRepository: IClinicsRepository,

    ){}

    async execute({
        idUser,
        idService,
        idClinic,
    }:IRequestServiceExecuted){
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.getUserSecurity(idUser)
        // validar se usuario existe pelo id
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }
        // buscar servico pelo id
        const findServiceExists = await this.servicesRepository.findById(idService)
        // validar se servico existe pelo id
        if(!findServiceExists){
            throw new ResourceNotFoundError()
        }
        // buscar clinica pelo id
        const findClinicExists = await this.clinicsRepository.findById(idClinic)
        // validar se clinica existe pelo id
        if(!findClinicExists){
            throw new ResourceNotFoundError()
        }
        // salvar service executed no banco de dados
        const serviceExecuted = await this.serviceExecutedRepository.create({
            idUser,
            idService,
            idClinic,
            price: findServiceExists.price,
        })
        
        // criar array de urls dos exames
        // let listUrlExams: string[] = []
    //     // variaveis para o template de email
    //     let serviceMessage = ''
    //     let sujectService = ''
    //     let serviceName = ''

    //     // verificar qual servico foi executado e personalizar mensagem
    //     switch(findServiceExists.category){
    //         case 'EXAM':
    //             serviceMessage = 'que o Exame Médico'
    //             sujectService = 'Novo Exame Médico'
    //             serviceName = 'Exame Médico'
    //         break;
    //         case 'QUERY':
    //             serviceMessage = 'que a Consulta Médica'
    //             sujectService = 'Nova Consulta Médica'
    //             serviceName = 'Consulta Médica'
    //         break;
    //         case 'SURGERY':
    //             serviceMessage = 'que a Cirurgia Médica'
    //             sujectService = 'Nova Cirurgia Médica'
    //             serviceName = 'Cirurgia Médica'
    //         break;
    //     }

    //     // variavels para o template de email
    //     const variablesServiceExecuted:IServiceExecuted = {
    //         name: findUserExist.name,
    //         email: findUserExist.email,
    //         service: serviceName,
    //         clinic: findClinicExists.name,
    //         date: date,
    //         dataPayment: dataPayment,
    //         price: Number(findServiceExists.price),
    //         exams: listUrlExams,
    //         serviceMessage
    //     }

    //     // Enviar emails para admin e para o usuario
    // const listToSendEmail = [
    //         {
    //             name: 'admin',
    //             email: 'kaio-dev@outlook.com',
    //             subject: sujectService,
    //             pathTemplate: './views/emails/admin.hbs'
    //         },
    //         // {
    //         //     name: 'doctor',
    //         //     email: 'doctor@test.com',
    //         //     subject: sujectService,
    //         //     pathTemplate: ''
    //         // },
    //         {
    //             name: findUserExist.name,
    //             email: 'kaio-dev@outlook.com',
    //             subject: 'Recibo do Pagamento',
    //             pathTemplate: './views/emails/payment-confirmed.hbs'
    //         }
    //     ]
    //     // enviar email para admin com serviceExecuted criado
    //     for(let to of listToSendEmail){
    //         // await this.sendMailProvider.sendEmail(
    //         //     to.email,
    //         //     to.name,
    //         //     to.subject,
    //         //     '',
    //         //     to.pathTemplate,
    //         //     variablesServiceExecuted)
            
    //     }

        const price = await this.serviceExecutedRepository.getterPriceAsNumber(serviceExecuted.id) as number

        const serviceExecutedResponse: IResponseServiceExecuted = {
            ...serviceExecuted,
            price
        }
        return serviceExecutedResponse
    }
}