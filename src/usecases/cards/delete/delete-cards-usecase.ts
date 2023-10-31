import 'dotenv/config'
import { ICardRepository } from "@/repositories/interface-cards-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestDeleteCard {
    id: string;
}

export class DeleteCardUseCase{
    constructor(
        private cardsRepository: ICardRepository,
    ) {}

    async execute({
        id
    }:IRequestDeleteCard):Promise<void>{
        // buscar o cartao pelo id
        const card = await this.cardsRepository.findById(id);

        // verificar se o cartao existe
        if(!card){
            throw new AppError("Cartão não encontrado",404);
        }

        // deletar o cartao
        await this.cardsRepository.deleteById(id);
    }
}