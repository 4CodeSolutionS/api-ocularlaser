import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { FindUserUseCase } from "./find-user-usecase";
import { hash } from "bcrypt";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";

let usersRepositoryInMemory: InMemoryUsersRepository;
let cardRepositoryInMemory: InMemoryCardRepository;
let stu: FindUserUseCase;

describe("Find user (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        stu = new FindUserUseCase(
            usersRepositoryInMemory, 
        )

         await usersRepositoryInMemory.create({
            id:'id-user-1',
            cpf: "12345678910",
            email: 'user-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to find user", async () => {
        const findUser = await stu.execute({
            id: 'id-user-1'
        });
        expect(findUser.user).toEqual(
            expect.objectContaining({
                id: 'id-user-1'
            })
        )
    });

    test("Should not be able to find user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

})