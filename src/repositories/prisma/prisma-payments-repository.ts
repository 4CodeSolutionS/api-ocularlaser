import { $Enums, Payment, Prisma } from "@prisma/client";
import { IPaymentsRepository } from "../interface-payments-repository";
import { prisma } from "@/lib/prisma";

export class PrismaPaymentRepository implements IPaymentsRepository{
    async listByPaymentStatus(status: string, page?: number | undefined): Promise<{ id: string; idPaymentAsaas: string; idUser: string; idServiceExecuted: string; invoiceUrl: string; installmentCount: Prisma.Decimal | null; installmentValue: Prisma.Decimal | null; paymentMethod: $Enums.PaymentMethod; paymentStatus: $Enums.Status; value: Prisma.Decimal; netValue: Prisma.Decimal; datePayment: Date | null; }[]> {
        throw new Error("Method not implemented.");
    }
    async findByIdServiceExecuted(id: string){
        const payment = await prisma.payment.findUnique({
            where:{
                idServiceExecuted: id,
            }
        })

        return payment
    }
   
    async deleteById(id: string): Promise<void> {
        await prisma.payment.delete({
            where:{
                id
            }
        })
    }
   
    async create(data: Prisma.PaymentUncheckedCreateInput){
        const payment = await prisma.payment.create({
            data,
            select:{
                id: true,
                idPaymentAsaas: true,
                serviceExecuted: {
                    select:{
                        id: true,
                        user:{
                            select:{
                                id: true,
                                idCostumerAsaas: true,
                                name: true,
                                email: true,
                                phone: true,
                                cpf: true,
                                role: true,
                                gender: true,
                                emailActive: true,
                                createdAt: true,
                                clinic: {
                                    select:{
                                        id: true,
                                        name: true,
                                        address: true,
                                    }
                                },
                            }
                        },
                        clinic: true,
                        service: true,
                        price: true,
                        approved: true,
                        exams: true,
                    }
                },
                datePayment: true,
                installmentCount: true,
                installmentValue: true,
                invoiceUrl: true,
                paymentMethod: true,
                paymentStatus: true,
                value: true,
                netValue: true,
            }
        }) as unknown as Payment
        return payment
    }

    async list(page: number){
        const payments = await prisma.payment.findMany({
            take: 20,
            skip: (page - 1) * 20
        })
        return payments
    }

    async findById(id: string){
        const payment = await prisma.payment.findUnique({
            where: {
                id
            }
        })
        return payment
    }

}