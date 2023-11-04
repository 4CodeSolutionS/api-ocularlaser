import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { UpdateUserUseCase } from "./update-user-usecase";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { AppError } from "@/usecases/errors/app-error";

let cardRepositoryInMemory: InMemoryCardRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdateUserUseCase;

describe("Update user (unit)", () => {
    beforeEach(async() => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        stu = new UpdateUserUseCase(
            usersRepositoryInMemory, 
        )

        await usersRepositoryInMemory.create({
            id: 'id-user-1',
            cpf: "12345678910",
            email: 'user1-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
        
        await usersRepositoryInMemory.create({
            id: 'id-user-2',
            cpf: "165484986",
            email: 'user2-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to update a user account", async () => {
        const { user } = await stu.execute({ 
            id: 'id-user-1',
            cpf: "132.000.789-10",
            email: 'user2@test.com',
            gender: 'MASCULINO',
            name: 'Kaio Moreira',
            phone: '77-88888-7777',
        });

        expect(user).toEqual(
            expect.objectContaining({
                id: 'id-user-1',
                cpf: "132.000.789-10",
                email: 'user2@test.com',
                gender: 'MASCULINO',
                name: 'Kaio Moreira',
                phone: '77-88888-7777',
            }),
        )
    });

    test("Should not be able to update a user account with id invalid", async () => {
        await expect(()=> stu.execute({ 
            id: 'id-user-3',
            cpf: "132.000.789-10",
            email: 'user2@test.com',
            gender: 'MASCULINO',
            name: 'Kaio Moreira',
            phone: '77-88888-7777',
        })).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

    test("Should not be able to update a user account with CPF already exists", async () => {
        await expect(() => stu.execute({ 
            id: 'id-user-1',
            cpf: "165484986",
            email: 'user1-test@email.com',
            gender: 'MASCULINO',
            name: 'Kaio Moreira',
            phone: '77-88888-7777',
        }),
            ).rejects.toEqual(new AppError('CPF já cadastrado', 400))
    });

    test("Should not be able to update a user account with Email already exists", async () => {
        await expect(() => stu.execute({ 
            id: 'id-user-2',
            cpf: "165484986",
            email: 'user1-test@email.com',
            gender: 'MASCULINO',
            name: 'Kaio Moreira',
            phone: '77-88888-7777',
        }),
            ).rejects.toEqual(new AppError('Email já cadastrado', 400))
    });

   
});