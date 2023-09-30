import { Prisma, ServiceExecuted, Status } from "@prisma/client"

export interface IServiceExecutedRepository {
    create(data: Prisma.ServiceExecutedUncheckedCreateInput):Promise<ServiceExecuted>
    list(page?:number):Promise<ServiceExecuted[]>
    listByPaymentStatus(status:Status, page?: number):Promise<ServiceExecuted[]>
    listByClinicId(idClinic:string, page?:number):Promise<ServiceExecuted[]>  
    listByUserId(idUser:string, page?:number):Promise<ServiceExecuted[]> 
    listByServiceId(idService:string, page?:number):Promise<ServiceExecuted[]> 
    findById(id:string):Promise<ServiceExecuted | null>
    aproveById(id:string):Promise<void>
    getterPriceAsNumber(id:string):Promise<number | null>
}