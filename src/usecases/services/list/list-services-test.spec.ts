import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ListServiceUseCase } from "./list-services-usecase";

let serviceRepositoryInMemory: InMemoryServicesRepository;
let stu: ListServiceUseCase;

describe("Find service (unit)", () => {
    beforeEach(async () => {
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        stu = new ListServiceUseCase(
            serviceRepositoryInMemory, 
        )

        await serviceRepositoryInMemory.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
            name: 'Avaliação dos dentes',
            price: 100,
            category: 'QUERY'
        })

        await serviceRepositoryInMemory.create({
            id: 'cc488b85-2e6c-4b81-946b-331db4cf4665',
            name: 'Avaliação dos olhos',
            price: 100,
            category: 'QUERY'
        })
    });

    test("Should be able to list all service", async () => {
       const {services} = await stu.execute()

        expect(services.length).toBe(2)
        expect(services).toEqual([
            expect.objectContaining({
                name: 'Avaliação dos dentes',
            }),
            expect.objectContaining({
                name: 'Avaliação dos olhos',
            }),
        ])
        
    });
})