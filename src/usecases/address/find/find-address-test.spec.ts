import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { FindAddressUseCase } from "./find-address-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: FindAddressUseCase;

describe("Find address (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        stu = new FindAddressUseCase(
            addressInMemoryRepository, 
        )

        await addressInMemoryRepository.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
            idClinic: '152deda6-b234-4632-9200-50522635994c',
            street: 'Rua 1',
            complement: 'Casa',
            neighborhood: 'Bairro 1',
            num: 1,
            reference: 'Perto do mercado',
            state: 'SP',
            zip: '12345678',
            city: 'São Paulo'
                
        })
    });

    test("Should be able to find a address", async () => {
       const {address} = await stu.execute({
            idClinic: '152deda6-b234-4632-9200-50522635994c'
       })

        expect(address).toEqual(
            expect.objectContaining({
                street: 'Rua 1',
            })
        )
    });

    test("Should not be able to find a address with id invalid", async () => {
        await expect( () => stu.execute({
                idClinic: '7881f50f-46dc-4b7d-b5d6-84bc924023e3'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})