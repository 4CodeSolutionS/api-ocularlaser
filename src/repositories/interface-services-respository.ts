import { Prisma, Service } from "@prisma/client"

export interface IServiceRepository {
    create(data:Prisma.ServiceUncheckedCreateInput):Promise<Service>
    list():Promise<Service[]>
    findById(id:string):Promise<Service | null>
    findByName(name:string):Promise<Service | null>
    updateById(data: Prisma.ServiceUncheckedUpdateInput):Promise<Service>
    deleteById(id:string):Promise<void>
}