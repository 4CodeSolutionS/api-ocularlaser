import 'dotenv/config'
import { ICardRepository } from "@/repositories/interface-cards-repository";
import { AppError } from "@/usecases/errors/app-error";
import { IUsersRepository } from '@/repositories/interface-users-repository';
import { Card, User } from '@prisma/client';

interface IRequestFindCard {
    idUser: string;
}

export class FindCardByUserUseCase{
    constructor(
        private cardsRepository: ICardRepository,
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        idUser
    }:IRequestFindCard):Promise<Card>{
        // buscar o usuario pelo id
        const user = await this.usersRepository.findById(idUser);

        // verificar se o usuario existe
        if(!user){
            throw new AppError("Usuário não encontrado", 404);
        }

        // buscar o cartao pelo id
        const card = await this.cardsRepository.findByIdUser(idUser);

        // verificar se o cartao existe
        if(!card){
            throw new AppError("Cartão não encontrado", 404);
        }

        // retornar o cartao
        return card;
    }
}