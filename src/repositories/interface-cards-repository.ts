import { Card, Prisma } from "@prisma/client"

export interface ICardRepository {
    create(data:Prisma.CardUncheckedCreateInput):Promise<Card>
    findById(id:string):Promise<Card | null>
    findByIdUser(idUser:string):Promise<Card | null>
    updateTokenCard(id:string, tokenCardAsaas: string):Promise<Card>
    deleteById(id:string):Promise<void>
}