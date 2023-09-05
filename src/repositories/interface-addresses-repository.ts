import { Address, Prisma } from "@prisma/client"

export interface IAddressesRepository {
    create(data: Prisma.AddressUncheckedCreateInput):Promise<Address>
    findById(id:string):Promise<Address | null>
    update(data: Prisma.AddressUncheckedUpdateInput):Promise<Address>
    delete(id:string):Promise<void>
}