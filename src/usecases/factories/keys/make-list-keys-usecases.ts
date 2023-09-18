import { PrismaKeysRepository } from "@/repositories/prisma/prisma-keys-repository";
import { ListKeyUseCase } from "@/usecases/keys/list/list-keys-usecase";

export async function makeListKey(): Promise<ListKeyUseCase> {
    const keysRepository = new PrismaKeysRepository()
    const listKeyUseCase = new ListKeyUseCase(keysRepository)

    return listKeyUseCase
}