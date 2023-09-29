import { $Enums, Payment, Prisma, Status } from "@prisma/client";
import { IPaymentsRepository } from "../interface-payments-repository";
import { randomUUID } from "crypto";

export class InMemoryPaymentRepository implements IPaymentsRepository{
    private payments: Payment[] = [];
    
    async findByIdCostumerPayment(id: string){
        const payment = this.payments.find(payment => payment.idCostumer === id)

        if(!payment){
            return null
        }

        return payment
    }

    async deleteById(id: string){
        const findPaymentIndex = this.payments.findIndex(payment => payment.id === id)

        this.payments.splice(findPaymentIndex, 1)
    }

    async updateStatus(id: string, status: string){
        const findPaymentIndex = this.payments.findIndex(payment => payment.id === id)


        return this.payments[findPaymentIndex]
    }

    async create({
        id,
        idUser,
        idServiceExecuted,
        idPaymentAsaas,
        datePayment,
        idCostumer,
        paymentMethod,
        installmentCount,
        installmentValue,
        paymentStatus,
        invoiceUrl,
        value,
        netValue        
    }: Prisma.PaymentUncheckedCreateInput){
        const payment = {
            id: id ? id : randomUUID(),
            idUser,
            idServiceExecuted,
            idPaymentAsaas,
            idCostumer: idCostumer ? idCostumer : null,
            datePayment: datePayment ? new Date(datePayment as string) : null,
            value: new Prisma.Decimal(value as number),
            netValue: new Prisma.Decimal(netValue as number),
            installmentValue: installmentValue ? new Prisma.Decimal(installmentValue as number) : null,
            installmentCount: installmentCount ? new Prisma.Decimal(installmentCount as number) : null,
            paymentStatus: paymentStatus as Status,
            paymentMethod,
            invoiceUrl,
        }

        this.payments.push(payment)

        return payment
    }

    async list(page: number){
        const payments = this.payments
        .slice((page - 1) * 20, page * 20)

        return payments
    }
    
    async findById(id: string){
        const payment = this.payments.find(payment => payment.id === id)

        if(!payment){
            return null
        }

        return payment
    }

}