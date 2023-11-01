import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider'
import { IAsaasProvider } from '@/providers/PaymentProvider/interface-asaas-payment'
import { ICardRepository } from '@/repositories/interface-cards-repository'
import { IPaymentsRepository } from '@/repositories/interface-payments-repository'
import { IServiceExecutedRepository } from '@/repositories/interface-services-executeds-repository'
import { AppError } from '@/usecases/errors/app-error'
import { IServiceExecutedFormmated } from '@/usecases/servicesExecuted/mappers/list-service-executed-mapper'
import { cryptingData } from '@/utils/crypting-data'
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
        creditCard?: {
            creditCardToken: string
        }
    }
}

export class EventsWebHookPaymentsUseCases{
    constructor(
        private paymentsRepository: IPaymentsRepository,
        private serviceExecutedRepository: IServiceExecutedRepository,
        private asaasProvider: IAsaasProvider,
        private cardsRepository: ICardRepository,
        private mailProvider: IMailProvider
    ) {}

    async execute({
        event,
        payment
    }:IRequestReceiveEvent):Promise<any>{
        //[x] verifica se o evento é de pagamento é "PAYMENT_REPROVED_BY_RISK_ANALYSIS"
        if(event !== 'PAYMENT_RECEIVED' && event !== 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'){ 
            throw new AppError('Evento nao autorizado')
        }
        //[x] criar variavel installments para receber o valor e o numero de parcela
        let installmentCount = 0
        let installmentValue = 0
        //[x] verificar se o pagamento é parcelado
        if(payment.installment){
            //[x] buscar installments pelo id recebido no payment recebido
            const findInstallments = await this.asaasProvider.findUniqueInstallments(payment.installment)

            //[x] validar se o installments existe
            if(!findInstallments){
                throw new AppError('Installments não encontrado')
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
            throw new AppError('Service Executed não encontrado')
        }
        //[x] validar se o billingType é BOLETO se for retorna FETLOCK, senao retorna o billingType
        let method = payment.billingType === 'BOLETO' ? 'FETLOCK' : payment.billingType as PaymentMethod

        //[x] verificar no banco se ja existe um pagamento com o idServiceExecuted
        const findPaymentExist = await this.paymentsRepository.findById(String(payment.externalReference))
        if(findPaymentExist){
            throw new AppError('Pagamento já existe')
        }
        //[x] criar validação para caso o evento seja "REPROVED"
        if(event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'){
            //[] criar payment no banco de dados com os dados recebidos e status REPROVED
            const createPaymentReproved = await this.paymentsRepository.create({
                idUser: findServiceExecuted.user.id,
                idServiceExecuted: String(payment.externalReference),
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
            // const templatePathPacient = './views/emails/payment-reproved.hbs'
            //  //[x] enviar email para o usuario informando que o pagamento foi reprovado
            // await this.mailProvider.sendEmail(
            //     'kaio-dev@outlook.com', 
            //     'Kaio Moreira', 
            //     'Pagamento Reprovado', 
            //     null,
            //     templatePathPacient, 
            //     null)
            return createPaymentReproved;
        }
        //[x] criar pagamento APPROVED no banco de dados com os dados recebidos
        const createPaymentApproved = await this.paymentsRepository.create({
            idUser: findServiceExecuted.user.id,
            idServiceExecuted: String(payment.externalReference),
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
        console.log(payment)
        if(!payment.creditCard){
            return {
                payment: createPaymentApproved
            }
        }
        // criar cartão no banco de dados pelo id do usuario
        const findCard = await this.cardsRepository.findByIdUser(findServiceExecuted.user.id)
        // verificar se o cartão existe
        if(!findCard){
            throw new AppError('Cartão não encontrado')
        }
        //  criptografar token do cartão
        const cryptTokenCard = cryptingData(payment.creditCard.creditCardToken)

        // atualizar token tokenCardAsaas do cartão do usuario
        await this.cardsRepository.updateTokenCard(findCard.id, cryptTokenCard)
       
        return {
            payment: createPaymentApproved
        }
    }
}