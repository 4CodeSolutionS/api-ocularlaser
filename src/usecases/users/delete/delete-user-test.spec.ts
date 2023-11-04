import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DeleteUserUseCase } from "./delete-user-usecase";
import { User } from "@prisma/client";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { AppError } from "@/usecases/errors/app-error";

let cardRepositoryInMemory: InMemoryCardRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: DeleteUserUseCase;

describe("Delete user (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        stu = new DeleteUserUseCase(
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

    test("Should be able to delete user", async () => {
        await stu.execute({
            id: 'id-user-1'
        });
        
        const findUserExist = await usersRepositoryInMemory.getUserSecurity('id-user-1') as User

        expect(findUserExist).toEqual(null)
    });

    test("Should not be able to delete a user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

})