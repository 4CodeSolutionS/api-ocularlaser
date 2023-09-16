import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { FindServiceUseCase } from "./find-services-usecase";

let serviceRepositoryInMemory: InMemoryServicesRepository;
let stu: FindServiceUseCase;

describe("Find service (unit)", () => {
    beforeEach(async () => {
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        stu = new FindServiceUseCase(
            serviceRepositoryInMemory, 
        )

        await serviceRepositoryInMemory.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
            name: 'Avaliação dos dentes',
            price: 100,
            category: 'QUERY'
        })
    });

    test("Should be able to find a service", async () => {
       const {service} = await stu.execute({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536'
       })

        expect(service).toEqual(
            expect.objectContaining({
                name: 'Avaliação dos dentes',
            }),
        )
        
    });

    test("Should not be able to find service with invalid id", async () => {
        await expect(()=>  stu.execute({
           id: 'e5c3ef79-8e8c-422e-af07-2e8fb3bf2411'
       })). rejects.toBeInstanceOf(ResourceNotFoundError)
     });
})