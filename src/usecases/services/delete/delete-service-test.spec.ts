import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { DeleteServiceUseCase } from "./delete-services-usecase";
import { Service } from "@prisma/client";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let serviceRepositoryInMemory: InMemoryServicesRepository;
let stu: DeleteServiceUseCase;

describe("Delete service (unit)", () => {
    beforeEach(async () => {
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        stu = new DeleteServiceUseCase(
            serviceRepositoryInMemory, 
        )

        await serviceRepositoryInMemory.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
            name: 'Avaliação dos dentes',
            price: 100,
            category: 'QUERY'
        })
    });

    test("Should be able to delete a service", async () => {
       await stu.execute({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536'
       })

       const findService = await serviceRepositoryInMemory.findById('d118f664-7b7e-4d84-84b6-0d54fd729536') as Service

        expect(findService).toEqual(null)
        
    });

    test("Should not be able to delete service with invalid id", async () => {
        await expect(()=>  stu.execute({
           id: 'e5c3ef79-8e8c-422e-af07-2e8fb3bf2411'
       })). rejects.toBeInstanceOf(ResourceNotFoundError)
     });
})