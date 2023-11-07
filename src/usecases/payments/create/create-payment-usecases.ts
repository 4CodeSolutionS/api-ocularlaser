import 'dotenv/config'
import { Card, DiscountCoupon, PaymentMethod } from '@prisma/client';
import { IUsersRepository } from '@/repositories/interface-users-repository';
import { IAsaasProvider } from '@/providers/PaymentProvider/interface-asaas-payment';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IServiceExecutedRepository } from '@/repositories/interface-services-executeds-repository';
import { IServiceExecutedFormmated } from '@/usecases/servicesExecuted/mappers/list-service-executed-mapper';
import { IPaymentsRepository } from '@/repositories/interface-payments-repository';
import { ICardRepository } from '@/repositories/interface-cards-repository';
import { cryptingData } from '@/utils/crypting-data';
import { decryptingData } from '@/utils/decrypting-data';
import { compare, hash } from 'bcrypt';
import { AppError } from '@/usecases/errors/app-error';

export interface IClinic{
    id: string
    discountCoupons: string[]
}
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
    discount?: {
        value: number
        dueDateLimitDays: number
        type: string
    }
    creditCard?: {
        creditCardBrand: string
    }
    creditCardToken?: string
}

interface IRequestCreatePayment {
    idServiceExecuted: string
    billingType: PaymentMethod
    dueDate?: string
    description?: string
    installmentCount?: number
    installmentValue?: number
    creditCardToken?: string
    creditCard?: {
        holderName?: string
        number?: string 
        expiryMonth?: string
        expiryYear?: string
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
    coupon?: string
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
        private paymentRepository: IPaymentsRepository,
        private cardsRepository: ICardRepository,
    ) {}

    async execute({
        idServiceExecuted,
        billingType,
        coupon,
        creditCard,
        creditCardHolderInfo,
        installmentCount,
        installmentValue,
        remoteIp
    }:IRequestCreatePayment):Promise<IResponseCreatePayment>{
        // buscar um payment pelo idServiceExecuted
        const findPaymentExists = await this.paymentRepository.findByIdServiceExecuted(idServiceExecuted)
        // validar se existe um payment
        if(findPaymentExists){
            throw new AppError('Pagamento ja foi realizado', 400)
        }
        // buscar se existe uma service executed pelo id
        const findServiceExecutedExists = await this.serviceExecutedRepository.findById(idServiceExecuted) as unknown as IServiceExecutedFormmated
        // validar se existe uma service excuted
        if(!findServiceExecutedExists){
            throw new AppError('Serviço Executado não encontrado', 404)
        }
        //[x] desestruturar user do findServiceExecutedExists
        const { user, clinic } = findServiceExecutedExists
        const formatClinic = clinic as unknown as IClinic

        // variavel para armazenar o valor do desconto
        let discountValue = 0

        // validar se o cupom é valido caso existir
        if(coupon){
            for(let couponObject of formatClinic.discountCoupons){
                const formatCoupon = couponObject as unknown as DiscountCoupon
    
    
                if(formatCoupon.code !== coupon){
                    throw new AppError('Cupom inválido', 400)
                }
    
                let currentDate = new Date()
    
                const isValidCoupon = this.dateProvider.compareIfBefore(currentDate, formatCoupon.expireDate)   
    
                if(!isValidCoupon){
                    throw new AppError('Cupom inválido', 400)
                }
    
                discountValue = Number(formatCoupon.discount)
            }
        }

        // buscar usuario pelo id
        const findUser = await this.usersRepository.findById(user.id)

        // validar se existe um usuario
        if(!findUser){
            throw new AppError('Usuário não encontrado', 404)
        }

        // variavel para armazenar o id do cliente no asaas
        let newCustomer  = '';
        const newDate = this.dateProvider.dateNow()
        const formatDateToString = this.dateProvider.convertToUTC(newDate)
        // validar se o cliente existe no asaas se não existir criar
        if(!findUser.idCostumerAsaas){
            // atualizar user com o id do cliente no asaas
            const createCustomer = await this.asaasProvider.createCustomer({
                name: user.name,
                cpfCnpj: user.cpf,
                email: user.email,
                phone: user.phone,
            })
            if(!createCustomer){
                throw new AppError('Error ao criar cliente', 400)
            }
           const customer =  await this.usersRepository.updateIdCostumerPayment(findUser.id, createCustomer.id as string)
           newCustomer = String(customer.idCostumerAsaas)
        }

        // verificar se o usuario tem um idCostumerPayment se não tiver retorna o new customer criado anteriormente
        const idCostumerPayment = user.idCostumerAsaas ? user.idCostumerAsaas : String(newCustomer)
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
                discount:{
                    value: discountValue ? discountValue : 0,
                    dueDateLimitDays: 0,
                    type: 'PERCENTAGE'
                },
                remoteIp: String(remoteIp),
            }) as IAsaasPayment
            if(!payment){
                throw new AppError('Error ao criar pagamento', 400)
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
             const isValidInstallment = isNaN(installmentValue) ? 0 : installmentValue
            // verificar se ja existe token do cartão
            const {cards} = findUser as any
            const cardFormat = cards as Card[]

            // filtrar token do cartão
            const cardToken = cardFormat.find(card => card.idUser === findUser.id) 
            if(cardToken?.tokenCardAsaas){
                if(!creditCard){
                    throw new AppError('Credenciais inválidas', 400)
                }
                  // descriptografar dados token
                  const decrypTokenCard = decryptingData(cardToken.tokenCardAsaas as string)

                  // comparar ccv com ccv cryptografado
                  const isValidCCV = await compare(creditCard.ccv as string, cardToken.ccv as string)
  
                  // validar se ccv é valido
                  if(!isValidCCV){
                      throw new AppError('Credenciais inválidas', 400)
                  }
  
                  const payment = await this.asaasProvider.createPayment({
                      customer: idCostumerPayment,
                      billingType,
                      value: Number(findServiceExecutedExists.price),
                      dueDate: formatDateToString,
                      creditCardToken: decrypTokenCard,
                    //   installmentCount: installmentCount ? Number(installmentCount) : 0,
                    //   installmentValue: isValidInstallment,
                      description: findServiceExecutedExists.service.name,
                      discount:{
                        value: discountValue ? discountValue : 0,
                        dueDateLimitDays: 0,
                        type: 'PERCENTAGE'
                    },
                      externalReference: findServiceExecutedExists.id,
                      remoteIp: String(remoteIp),
                  }) as IAsaasPayment
                  return {
                      payment
                  }
              }
            // criar cobrança do pagamento no asaas
            const payment = await this.asaasProvider.createPayment({
                customer: idCostumerPayment,
                billingType,
                value: Number(findServiceExecutedExists.price),
                dueDate: formatDateToString,
                creditCard,
                creditCardHolderInfo,
                // installmentCount: installmentCount ? Number(installmentCount) : 0,
                // installmentValue:isValidInstallment,
                description: findServiceExecutedExists.service.name,
                discount:{
                    value: discountValue ? discountValue : 0,
                    dueDateLimitDays: 0,
                    type: 'PERCENTAGE'
                },
                externalReference: findServiceExecutedExists.id,
                remoteIp: String(remoteIp),
            }) as IAsaasPayment
            if(!payment){
                throw new AppError('Error ao criar pagamento', 400)
            }
            let criptData = []
            if(!creditCard){
                throw new AppError('Credenciais inválidas', 400)
            }

           if(cardToken?.idUser === findUser.id){
            return {
                payment
            }
           }
           const {number} = creditCard
           const formatNumber = number as string
           // formatando numero do cartão
           const formatNum = `****${formatNumber.slice(-4)}`
           // criptografar dados do cartão
           for(let value of [formatNum, creditCard.holderName, `${creditCard.expiryMonth}/${creditCard.expiryYear}`, `${payment.creditCard?.creditCardBrand}`]){
               const valueCrypt = cryptingData(value as string)
               criptData.push(valueCrypt)
           }

           // criptografar ccv com bcrypt hash
           const hashCCV = await hash(creditCard.ccv as string, 8)
           
           // salvar dados do cartão no banco de dados
           const card = await this.cardsRepository.create({
               idUser: findUser.id,
               num: criptData[0] as string,
               name: criptData[1] as string,
               expireDate: criptData[2] as string,
               ccv: hashCCV,
               brand: criptData[3] as string,
           })
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
            discount:{
                value: discountValue ? discountValue : 0,
                dueDateLimitDays: 0,
                type: 'PERCENTAGE'
            },
            externalReference: findServiceExecutedExists.id,
            remoteIp: String(remoteIp),
        }) as IAsaasPayment

        if(!payment){
            throw new AppError('Error ao criar pagamento', 400)
        }
        return {
            payment,
        }
    }
}