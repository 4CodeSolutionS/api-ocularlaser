import { Card, Prisma } from "@prisma/client";
import { ICardRepository } from "../interface-cards-repository";
import { randomUUID } from "crypto";

export class InMemoryCardRepository implements ICardRepository{
    private cards: Card[] = [];

    async findByIdUser(idUser: string){
        const card = this.cards.find(card => card.idUser === idUser);

        if(!card){
            return null;
        }

        return card;
    }

    async updateTokenCard(id: string, tokenCardAsaas: string){
        const cardIndex = this.cards.findIndex(card => card.id === id);
        this.cards[cardIndex].tokenCardAsaas = tokenCardAsaas as string;

        return this.cards[cardIndex];
    }

    async create({
        id,
        idUser,
        tokenCardAsaas,
        name,
        num,
        ccv,
        expireDate
    }: Prisma.CardUncheckedCreateInput){
        const card = {
            id: id ? id: randomUUID(),
            idUser,
            tokenCardAsaas: tokenCardAsaas ? tokenCardAsaas: null,
            name,
            num,
            ccv,
            expireDate,
        }

        this.cards.push(card);

        return card;
    }

    async findById(id: string){
        const card = this.cards.find(card => card.id === id);

        if(!card){
            return null;
        }

        return card;
    }

    async deleteById(id: string){
        const cardIndex = this.cards.findIndex(card => card.id === id);

        if(cardIndex === -1){
            return;
        }

        this.cards.splice(cardIndex, 1);
    }
}