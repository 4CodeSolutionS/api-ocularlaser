import 'dotenv/config'
import { PaymentMethod } from '@prisma/client';
import { IUsersRepository } from '@/repositories/interface-users-repository';
import { IAsaasProvider } from '@/providers/PaymentProvider/interface-asaas-payment';
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IServiceExecutedRepository } from '@/repositories/interface-services-executeds-repository';
import { IServiceExecutedFormmated } from '@/usecases/servicesExecuted/mappers/list-service-executed-mapper';
import { InvalidCustomerError } from '@/usecases/errors/invalid-customer-error';
import { InvalidPaymentError } from '@/usecases/errors/invalid-payment-error';
import { IPaymentsRepository } from '@/repositories/interface-payments-repository';
import { PaymentAlreadyExistsError } from '@/usecases/errors/payment-already-exists-error';

export interface IAsaasPayment {
    id: string
    status: string
    customer: string
    billingType: string
    value: number
    netValue: number
    description: string
    invoiceUrl: string
    installment?: string
    externalReference: string
    paymentDate: string
    dueDate: string
}

interface IRequestCreatePayment {
    idServiceExecuted: string
    billingType: PaymentMethod
    dueDate?: string
    description?: string
    installmentCount?: number
    installmentValue?: number
    
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
}

export class CreatePaymentUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private asaasProvider: IAsaasProvider,
        private dateProvider: IDateProvider,
        private serviceExecutedRepository: IServiceExecutedRepository,
    ) {}

    async execute({
        idServiceExecuted,
        billingType,
        creditCard,
        creditCardHolderInfo,
        installmentCount,
        installmentValue,
        remoteIp
    }:IRequestCreatePayment):Promise<IResponseCreatePayment>{
       
        // buscar se existe uma service executed pelo id
        const findServiceExecutedExists = await this.serviceExecutedRepository.findById(idServiceExecuted) as unknown as IServiceExecutedFormmated
        // validar se existe uma service excuted
        if(!findServiceExecutedExists){
            throw new ResourceNotFoundError()
        }
        //[x] desestruturar user do findServiceExecutedExists
        const { user } = findServiceExecutedExists
        // variavel para armazenar o id do cliente no asaas
        let newCustomer  = '';
        const newDate = this.dateProvider.dateNow()
        const formatDateToString = this.dateProvider.convertToUTC(newDate)
        // validar se o cliente existe no asaas se não existir criar
        if(!user.idCostumerPayment){
            // atualizar user com o id do cliente no asaas
            const createCustomer = await this.asaasProvider.createCustomer({
                name: user.name,
                cpfCnpj: user.cpf,
                email: user.email,
                phone: user.phone,
            })
            if(!createCustomer){
                throw new InvalidCustomerError()
            }
           const customer =  await this.usersRepository.updateIdCostumerPayment(user.id, createCustomer.id as string)
           newCustomer = String(customer.idCostumerPayment)
        }

        // verificar se o usuario tem um idCostumerPayment se não tiver retorna o new customer criado anteriormente
        const idCostumerPayment = user.idCostumerPayment ? user.idCostumerPayment : String(newCustomer)
        // se o billingType for "pix" precisamos criar o pagamento na asaas
        // criar cobrança do pagamento no asaas
        if(billingType === 'PIX'){
            // criar cobrança do tipo pix no asaas
            const payment = await this.asaasProvider.createPayment({
                customer: idCostumerPayment,
                billingType,
                dueDate: formatDateToString,
                value: Number(findServiceExecutedExists.price),
                description: findServiceExecutedExists.service.name,
                externalReference: findServiceExecutedExists.id,
                remoteIp: String(remoteIp),
            }) as IAsaasPayment
            if(!payment){
                throw new InvalidPaymentError()
            }
            return {
                payment,
            }
        }
        
        // se o billingType for "cartão de crédito"
        // criar cobrança do pagamento no asaas
        if(billingType === 'CREDIT_CARD'){
            // calcular valor da parcela
            const installmentValue = (findServiceExecutedExists.price / Number(installmentCount)).toFixed(2) as unknown as number;
            // criar cobrança do pagamento no asaas
            const payment = await this.asaasProvider.createPayment({
                customer: idCostumerPayment,
                billingType,
                value: Number(findServiceExecutedExists.price),
                dueDate: formatDateToString,
                creditCard,
                creditCardHolderInfo,
                installmentCount: installmentCount ? Number(installmentCount) : undefined,
                installmentValue: Number.isNaN(installmentValue) ? undefined : installmentValue,
                description: findServiceExecutedExists.service.name,
                externalReference: findServiceExecutedExists.id,
                remoteIp: String(remoteIp),
            }) as IAsaasPayment
            if(!payment){
                throw new InvalidPaymentError()
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
            description: findServiceExecutedExists.service.name,
            externalReference: findServiceExecutedExists.id,
            remoteIp: String(remoteIp),
        }) as IAsaasPayment

        if(!payment){
            throw new InvalidPaymentError()
        }
        return {
            payment,
        }
    }
}