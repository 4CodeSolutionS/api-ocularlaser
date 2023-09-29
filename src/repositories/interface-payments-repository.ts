import { Payment, Prisma} from "@prisma/client"

export interface IPaymentsRepository {
    create(data:Prisma.PaymentUncheckedCreateInput):Promise<Payment>
    list(page: number):Promise<Payment[]>
    findById(id:string):Promise<Payment | null>
    findByIdServiceExecuted(id:string):Promise<Payment | null>
    deleteById(id:string):Promise<void>
}