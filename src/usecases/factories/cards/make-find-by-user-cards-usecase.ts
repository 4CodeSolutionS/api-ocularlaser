import { PrismaCardRepository } from "@/repositories/prisma/prisma-cards-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FindCardByUserUseCase } from "@/usecases/cards/find-by-user/find-by-user-cards-usecase";

export async function makeFindCardByUser(): Promise<FindCardByUserUseCase> {
    const cardRepository = new PrismaCardRepository();
    const usersRepository = new PrismaUsersRepository();
    const findCardByUserUseCase = new FindCardByUserUseCase(
        cardRepository,
        usersRepository
        )

    return findCardByUserUseCase
}