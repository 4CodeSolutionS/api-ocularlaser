import { randomUUID } from "crypto";
import { IAsaasProvider, IChargeData, ICustomerData } from "../interface-asaas-payment";
interface IInstallmentsInfo {
    id: string
    installments?: string
    installmentCount?: number
    paymentValue?: number
}
interface IPayment{
    id:string,
    customer: string,
    value: number,
    billingType: string,
    installments: string,
    creditCard: any,
    status: string,
    dueDate: string,
    invoiceUrl: string,
    externalReference: string,
}
export class InMemoryAsaasProvider implements IAsaasProvider{
    private payments: IChargeData[] = []
    private customers: ICustomerData[] = []
    private installments: IInstallmentsInfo[] = []

    async createPayment({
        customer,
        billingType,
        value,
        dueDate,
        installmentCount,
        installmentValue,
        installments,
        description,
        externalReference,
        creditCard,
        creditCardHolderInfo,
        discount,
        fine,
        interest,
        remoteIp
    }: IChargeData){
        const payment = {
            id: randomUUID(),
            customer,
            billingType,
            value,
            dueDate,
            installmentCount,
            installmentValue,
            installments,
            description,
            externalReference,
            creditCard,
            creditCardHolderInfo,
            discount,
            fine,
            interest,
            remoteIp
        }
        const instalmentsInfo = {
            id: randomUUID(),
            installments: randomUUID(),
            installmentCount: installmentCount as number,
            paymentValue: installmentValue as number
        }

        this.payments.push(payment)
        this.installments.push(instalmentsInfo)

        return {
            id: payment.id,
            customer: payment.customer,
            value: payment.value,
            billingType: payment.billingType,
            installments: instalmentsInfo.id,
            creditCard,
            status: 'PAYMENT_RECEIVED',
            dueDate: payment.dueDate,
            invoiceUrl: 'https://invoice.com',
            description: payment.description,
            externalReference,
        } as IPayment
    }
    
    async createCustomer({
        cpfCnpj,
        email,
        name,
        phone
    }: ICustomerData){
        const customer = {
            id: randomUUID(),
            cpfCnpj,
            email,
            name,
            phone
        }

        this.customers.push(customer)

        return customer
    }

    async findUniqueInstallments(idInstallment: string){
       const findInstallments = this.installments.find(installment => installment.id === idInstallment)
       
       if(!findInstallments){
            return null
       }

        return findInstallments
    }
}