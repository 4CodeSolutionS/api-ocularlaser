import { $Enums, Payment, Prisma } from "@prisma/client";
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
        datePayment,
        idCostumer,
        paymentMethod,
        installmentCount,
        installmentValue,
        invoiceUrl,
        value        
    }: Prisma.PaymentUncheckedCreateInput){
        const payment = {
            id: id ? id : randomUUID(),
            idUser,
            idServiceExecuted,
            idCostumer: idCostumer ? idCostumer : null,
            datePayment: new Date(datePayment as string),
            value: new Prisma.Decimal(value as number),
            installmentValue: installmentValue ? new Prisma.Decimal(installmentValue as number) : null,
            installmentCount: installmentCount ? new Prisma.Decimal(installmentCount as number) : null,
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