import { beforeEach, describe, expect, test } from "vitest";
import { DeleteCardUseCase } from "./delete-cards-usecase";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Card } from "@prisma/client";

let cardRepositoryInMemory: InMemoryCardRepository;
let stu: DeleteCardUseCase;

describe("Delete card (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        stu = new DeleteCardUseCase(
            cardRepositoryInMemory, 
        )

        await cardRepositoryInMemory.create({
            id: '152deda6-b234-4632-9200-50522635994c',
            idUser: 'db8b2111-9dfb-4e82-8fcc-cc0dfc72e59e',
            name: 'Nome teste cartao',
            num: '1234567891234567',
            expireDate: '2021-10-10',
        })
    });

    test("Should be able to delete a card", async () => {
       await stu.execute({
            id: '152deda6-b234-4632-9200-50522635994c'
       })

      const findCardExists = await cardRepositoryInMemory.findById('152deda6-b234-4632-9200-50522635994c') as Card

        expect(findCardExists).toEqual(null)
    });

    test("Should not be able to delete a card", async () => {
        const fakeId = '9ff379c1-4d49-483e-a4a3-5f897d54ec0c'        
        
        await expect(()=> stu.execute({
            id: fakeId
        })). rejects.toEqual(new AppError('Cartão não encontrado',404))
     });
})