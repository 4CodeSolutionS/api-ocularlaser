import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider'
import { IAsaasProvider } from '@/providers/PaymentProvider/interface-asaas-payment'
import { IPaymentsRepository } from '@/repositories/interface-payments-repository'
import { IServiceExecutedRepository } from '@/repositories/interface-services-executeds-repository'
import { CredentialsInvalidError } from '@/usecases/errors/credentials-invalid-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { IServiceExecutedFormmated } from '@/usecases/servicesExecuted/mappers/list-service-executed-mapper'
import { PaymentMethod, Prisma} from '@prisma/client'
import 'dotenv/config'

export interface IRequestReceiveEvent {
    event: string
    payment: {
        id: string
        customer: string
        invoiceUrl: string
        description?: string
        externalReference?: string
        billingType: string
        paymentDate?: string
        installment?: string
        value: number
        netValue: number
    }
}

export class EventsWebHookPaymentsUseCases{
    constructor(
        private paymentsRepository: IPaymentsRepository,
        private serviceExecutedRepository: IServiceExecutedRepository,
        private asaasProvider: IAsaasProvider,
        private mailProvider: IMailProvider
    ) {}

    async execute({
        event,
        payment
    }:IRequestReceiveEvent):Promise<any>{
        //[x] verifica se o evento é de pagamento é "PAYMENT_RECEIVED"
        if(event !== 'PAYMENT_RECEIVED' && event !== 'PAYMENT_REPROVED'){ 
            throw new EmailAlreadyExistsError()
        }
        //[x] criar variavel installments para receber o valor e o numero de parcelo
        let installmentCount = 0
        let installmentValue = 0
        //[x] verificar se o pagamento é parcelado
        if(payment.installment){
            //[x] buscar installments pelo id recebido no payment recebido
            const findInstallments = await this.asaasProvider.findUniqueInstallments(payment.installment)

            //[x] validar se o installments existe
            if(!findInstallments){
                throw new CredentialsInvalidError()
            }

            //[x] criar variavel installmentValue para receber o valor da parcela
            installmentValue = findInstallments.paymentValue

            //[x] criar variavel installmentCount para receber o quantiade de parcela
            installmentCount = findInstallments.installmentCount

        } 
        //[x] buscar service executed pelo id recebido no externalReference
        const findServiceExecuted = await this.serviceExecutedRepository.findById(String(payment.externalReference)) as unknown as IServiceExecutedFormmated
        //[x] validar se o service executed existe
        if(!findServiceExecuted){
            console.log('service executed not found')
            throw new ResourceNotFoundError()
        }
        //[x] validar se o billingType é BOLETO se for retorna FETLOCK, senao retorna o billingType
        let method = payment.billingType === 'BOLETO' ? 'FETLOCK' : payment.billingType as PaymentMethod

        //[] criar validação para caso o evento seja "REPROVED"
        if(event === 'PAYMENT_REPROVED'){
            //[] criar payment no banco de dados com os dados recebidos e status REPROVED
            const createPaymentReproved = await this.paymentsRepository.create({
                idUser: findServiceExecuted.user.id,
                idServiceExecuted: String(payment.externalReference),
                idCostumer: payment.customer,
                idPaymentAsaas: payment.id,
                paymentMethod: method,
                installmentCount,
                installmentValue,
                paymentStatus: 'REPROVED',
                invoiceUrl: payment.invoiceUrl,
                value: findServiceExecuted.price,
                netValue: new Prisma.Decimal(payment.netValue),
                datePayment: payment.paymentDate ? new Date(payment.paymentDate) : undefined
            })
            //[x] criar variavel com caminho do templeate de email de pagamento reprovado
            const templatePathPacient = './views/emails/payment-reproved.hbs'
             //[x] enviar email para o usuario informando que o pagamento foi reprovado
            await this.mailProvider.sendEmail(
                'kaio-dev@outlook.com', 
                'Kaio Moreira', 
                'Pagamento Reprovado', 
                null,
                templatePathPacient, 
                null)
            return createPaymentReproved;
        }
        console.log('id do customer')
        console.log(payment.customer)
        //[x] criar pagamento APPROVED no banco de dados com os dados recebidos
        const createPaymentApproved = await this.paymentsRepository.create({
            idUser: findServiceExecuted.user.id,
            idServiceExecuted: String(payment.externalReference),
            idCostumer: payment.customer ? String(payment.customer) : undefined,
            idPaymentAsaas: payment.id,
            paymentMethod: method,
            installmentCount,
            installmentValue,
            paymentStatus: 'APPROVED',
            invoiceUrl: payment.invoiceUrl,
            value: findServiceExecuted.price,
            netValue: new Prisma.Decimal(payment.netValue),
            datePayment: payment.paymentDate ? new Date(payment.paymentDate) : undefined
        })
        //[x] criar variavel com caminho do template de email
        const templatePathPacient = './views/emails/payment-confirmed.hbs'
        const templatePathAdmin = './views/emails/admin.hbs'
       
        //[x]* disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
        // const sendInvoiceToUser = await this.mailProvider.sendEmail(
        //     'kaio-dev@outlook.com', 
        //     'Kaio Moreira', 
        //     'Pagamento Confirmado', 
        //     payment.invoiceUrl,
        //     templatePathPacient, 
        //     null)

        //[]* disparar envio de email de pagamento recebido para o admin com comprovante(payment - banco de dados API)
        // const sendInvoiceToUser = await this.mailProvider.sendEmail(
        //     'kaio-dev@outlook.com', 
        //     findUserByCostumer.name, 
        //     'Pagamento Confirmado', 
        //     null,
        //     templatePathAdmin, 
        //     null)
        return {
            payment: createPaymentApproved
        }
    }
}