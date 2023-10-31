import { Prisma } from "@prisma/client";
import { ICardRepository } from "../interface-cards-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCardRepository implements ICardRepository{
    async findByIdUser(idUser: string){
        const card = await prisma.card.findUnique({where: {idUser}});

        return card;
    }
    async updateTokenCard(id: string, tokenCardAsaas: string){
        const card = await prisma.card.update({
            where: {id},
            data: {tokenCardAsaas}
        });

        return card;
    }
    async create(data: Prisma.CardUncheckedCreateInput){
        const card = await prisma.card.create({data});

        return card;
    }

    async findById(id: string){
        const card = await prisma.card.findUnique({where: {id}});

        return card;
    }

    async deleteById(id: string){
        await prisma.card.delete({where: {id}});
    }
}