import { $Enums, Prisma } from "@prisma/client";
import { IPaymentsRepository } from "../interface-payments-repository";
import { prisma } from "@/lib/prisma";

export class PrismaPaymentRepository implements IPaymentsRepository{
    async findByIdCostumerPayment(id: string){
        const payment = await prisma.payment.findUnique({
            where:{
                idCostumer: id
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
        const payment = await prisma.payment.create({data})
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