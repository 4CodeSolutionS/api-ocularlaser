import { Clinic, Prisma } from "@prisma/client"

export interface IClinicsRepository {
    create(data:Prisma.ClinicUncheckedCreateInput):Promise<Clinic>
    list():Promise<Clinic[]>
    findById(id:string):Promise<Clinic | null>
    findByName(name:string):Promise<Clinic | null>
    updateById(data:Prisma.ClinicUncheckedUpdateInput):Promise<Clinic>
    deleteById(id:string):Promise<void>
}