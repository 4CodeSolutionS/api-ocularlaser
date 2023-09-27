import 'dotenv/config'
import { PaymentMethod } from '@prisma/client';
import { IUsersRepository } from '@/repositories/interface-users-repository';
import { IAsaasProvider } from '@/providers/PaymentProvider/interface-asaas-payment';
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IServiceExecutedRepository } from '@/repositories/interface-services-executeds-repository';
import { IServiceExecutedFormmated } from '@/usecases/servicesExecuted/mappers/list-service-executed-mapper';

interface IAsaasPayment {
    id: string
    status: string
    customer: string
    billingType: string
    value: number
    dueDate: string
    description: string
    invoiceUrl: string
}

interface IRequestCreatePayment {
    idUser: string
    idServiceExecuted: string
    billingType: PaymentMethod
    dueDate?: string
    description?: string
    installmentCount?: number
    installmentValue?: number

    discount?: {
        value: number
        dueDateLimitDays: number
        type: 'FIXED' | 'PERCENTAGE'
    }
    creditCard?: {
        holderName: string
        number: string 
        expiryMonth: string
        expiryYear: string
        ccv: string
    }
    creditCardHolderInfo?: {
        name: string
        email: string
        cpfCnpj: string
        postalCode: string
        addressNumber: string
        addressComplement: string
        phone: string
    },
    remoteIp: string

}

interface IResponseCreatePayment {
    payment: IAsaasPayment,
    invoiceUrl?: string
}

export class CreatePaymentUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private asaasProvider: IAsaasProvider,
        private dateProvider: IDateProvider,
        private serviceExecutedRepository: IServiceExecutedRepository
    ) {}

    async execute({
        idUser,
        idServiceExecuted,
        billingType,
        discount,
        creditCard,
        creditCardHolderInfo,
        installmentCount,
        installmentValue,
        remoteIp
    }:IRequestCreatePayment):Promise<IResponseCreatePayment>{
        // encontrar usuario pelo id
        let findUserExist = await this.usersRepository.getUserSecurity(idUser)

        // validar se usuario existe
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }

        // buscar se existe uma service executed pelo id
        const findServiceExecutedExists = await this.serviceExecutedRepository.findById(idServiceExecuted) as unknown as IServiceExecutedFormmated
        
        // validar se existe uma service excuted
        if(!findServiceExecutedExists){
            throw new ResourceNotFoundError()
        }
        // variavel para armazenar o id do cliente no asaas
        let newCustomer  = '';
        const newDate = this.dateProvider.dateNow()
        const formatDateToString = this.dateProvider.convertToUTC(newDate)
        // validar se o cliente existe no asaas se não existir criar
        if(!findUserExist.idCostumerPayment){
            // atualizar user com o id do cliente no asaas
            const createCustomer = await this.asaasProvider.createCustomer({
                name: findUserExist.name,
                cpfCnpj: findUserExist.cpf,
                email: findUserExist.email,
                phone: findUserExist.phone,
            })

           const customer =  await this.usersRepository.updateIdCostumerPayment(idUser, createCustomer.id)

           newCustomer = String(customer.idCostumerPayment)
        }

        // verificar se o usuario tem um idCostumerPayment se não tiver retorna o new customer criado anteriormente
        const idCostumerPayment = findUserExist.idCostumerPayment ? findUserExist.idCostumerPayment : String(newCustomer)
        // se o billingType for "pix" precisamos criar o pagamento na asaas
        // criar cobrança do pagamento no asaas
        if(billingType === 'PIX'){
            // criar cobrança do tipo pix no asaas
            const payment = await this.asaasProvider.createPayment({
                customer: idCostumerPayment,
                billingType,
                dueDate: formatDateToString,
                value: Number(findServiceExecutedExists.price),
                discount,
                description: findServiceExecutedExists.service.name,
                externalReference: findServiceExecutedExists.id,
                remoteIp: String(remoteIp),
            }) as IAsaasPayment

            if(!payment){
                throw new Error('Error create payment in ASAAS')
            }
            return {
                payment,
                invoiceUrl: payment.invoiceUrl,
            }
        }
        
        // se o billingType for "cartão de crédito"
        // criar cobrança do pagamento no asaas
        if(billingType === 'CREDIT_CARD'){
            // criar cobrança do pagamento no asaas
            const payment = await this.asaasProvider.createPayment({
                customer: idCostumerPayment,
                billingType,
                value: Number(findServiceExecutedExists.price),
                dueDate: formatDateToString,
                creditCard,
                creditCardHolderInfo,
                installmentCount,
                installmentValue,
                description: findServiceExecutedExists.service.name,
                externalReference: findServiceExecutedExists.id,
                discount,
                remoteIp: String(remoteIp),
            }) as IAsaasPayment

            if(!payment){
                throw new Error('Error create payment in ASAAS')
            }
            return {
                payment
            }
        }

        // então se o billingType for em "boleto bancário"
        // criar cobrança do pagamento no asaas
         const payment = await this.asaasProvider.createPayment({
            customer: idCostumerPayment,
            billingType: 'BOLETO',
            dueDate: formatDateToString,
            value: Number(findServiceExecutedExists.price),
            installmentCount,
            installmentValue,
            description: findServiceExecutedExists.service.name,
            externalReference: findServiceExecutedExists.id,
            discount,
            remoteIp: String(remoteIp),
        }) as IAsaasPayment

        if(!payment){
            throw new Error('Error create payment in ASAAS')
        }
        return {
            payment,
            invoiceUrl: payment.invoiceUrl,
        }
    }
}