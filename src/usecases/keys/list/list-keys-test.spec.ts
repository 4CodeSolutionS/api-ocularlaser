import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryKeysRepository } from "@/repositories/in-memory/in-memory-keys-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { CreateKeyUseCase } from "../create/create-keys-usecases";
import { ListKeyUseCase } from "./list-keys-usecase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let keysInMemoryRepository: InMemoryKeysRepository;
let createKeyUseCase: CreateKeyUseCase;
let stu: ListKeyUseCase;

describe("List keys (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        keysInMemoryRepository = new InMemoryKeysRepository()
        createKeyUseCase = new CreateKeyUseCase(
            keysInMemoryRepository,
        )
        stu = new ListKeyUseCase(
            keysInMemoryRepository, 
        )

        await usersRepositoryInMemory.create({
            id: 'd7a6666d-d6f4-4717-90ab-ec578b2750dd',
            cpf: "12345678910",
            email: 'user-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to list all key", async () => {
       for(let i = 1; i < 3; i++){
            await createKeyUseCase.execute()
       }

       const {keys} = await stu.execute()
       
       expect(keys).toHaveLength(2)
       expect(keys).toEqual([
        expect.objectContaining({
            id: expect.any(String),
        }),
        expect.objectContaining({
            id: expect.any(String),
        }),
       ])
    });
})