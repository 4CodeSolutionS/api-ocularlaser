import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { AppError } from "@/usecases/errors/app-error";
import { FindCardByUserUseCase } from "./find-by-user-cards-usecase";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";

let cardRepositoryInMemory: InMemoryCardRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: FindCardByUserUseCase;

describe("Find card by User (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        stu = new FindCardByUserUseCase(
            cardRepositoryInMemory, 
            usersRepositoryInMemory
        )

        await usersRepositoryInMemory.create({
            id:'ac3a104a-de7f-42d5-b915-6d45256dc978',
            cpf: "12345678910",
            email: 'user-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        });

        await cardRepositoryInMemory.create({
            id: '152deda6-b234-4632-9200-50522635994c',
            idUser: 'ac3a104a-de7f-42d5-b915-6d45256dc978',
            name: 'Nome teste cartao',
            num: '1234567891234567',
            expireDate: '2021-10-10',
            ccv: '123',
            brand: 'Visa'
        })
    });

    test("Should be able to find card by idUser", async () => {
       const findCardByUser = await stu.execute({
            idUser: 'ac3a104a-de7f-42d5-b915-6d45256dc978'
       })

       expect(findCardByUser).toEqual(
        expect.objectContaining({
            idUser: 'ac3a104a-de7f-42d5-b915-6d45256dc978'
        })
       )
    });

    test("Should not be able to find a card with idUser invalid", async () => {
        const fakeId = '9ff379c1-4d49-483e-a4a3-5f897d54ec0c'        
        
        await expect(()=> stu.execute({
            idUser: fakeId
        })). rejects.toEqual(new AppError('Usuário não encontrado',404))
     });
})