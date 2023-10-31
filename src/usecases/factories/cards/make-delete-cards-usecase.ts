import { PrismaCardRepository } from "@/repositories/prisma/prisma-cards-repository";
import { DeleteCardUseCase } from "@/usecases/cards/delete/delete-cards-usecase";

export async function makeDeleteCard(): Promise<DeleteCardUseCase> {
    const cardRepository = new PrismaCardRepository();
    const deleteCardUseCase = new DeleteCardUseCase(cardRepository)

    return deleteCardUseCase
}