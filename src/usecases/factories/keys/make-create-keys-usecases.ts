import { PrismaKeysRepository } from "@/repositories/prisma/prisma-keys-repository";
import { CreateKeyUseCase } from "@/usecases/keys/create/create-keys-usecases";

export async function makeCreateKey(): Promise<CreateKeyUseCase> {
    const keysRepository = new PrismaKeysRepository()
    const createKeyUseCase = new CreateKeyUseCase(keysRepository)

    return createKeyUseCase
}