import { Address, Prisma } from "@prisma/client"

export interface IAddressesRepository {
    create(data: Prisma.AddressUncheckedCreateInput):Promise<Address>
    findByClinicId(idClinic:string):Promise<Address | null>
    updateByClinicId(data: Prisma.AddressUncheckedUpdateInput):Promise<Address>
    delete(id:string):Promise<void>
}