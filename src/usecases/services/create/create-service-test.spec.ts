import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { CreateServiceUseCase } from "./create-services-usecase";
import { ServiceAlreadyExistsError } from "@/usecases/errors/service-already-exists-error";

let serviceRepositoryInMemory: InMemoryServicesRepository;
let stu: CreateServiceUseCase;

describe("Create service (unit)", () => {
    beforeEach(async () => {
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        stu = new CreateServiceUseCase(
            serviceRepositoryInMemory, 
        )

        await serviceRepositoryInMemory.create({
            name: 'Avaliação dos dentes',
            price: 100,
            category: 'QUERY'
        })
    });

    test("Should be able to create a service", async () => {
       const {service} = await stu.execute({
            name: 'Apuração dos olhos',
            price: 100,
            category: 'QUERY'
       })

        expect(service).toEqual(
            expect.objectContaining({
                name: 'Apuração dos olhos',
            })
        )
    });

    test("Should not be able to create service with name already exists", async () => {
        await expect(()=>  stu.execute({
            name: 'Avaliação dos dentes',
            price: 100,
            category: 'QUERY'
       })). rejects.toBeInstanceOf(ServiceAlreadyExistsError)
     });
})