import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { UpdateAddressUseCase } from "./update-addresses-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let addressInMemoryRepository: InMemoryAddressesRepository;
let stu: UpdateAddressUseCase;

describe("Update address (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        stu = new UpdateAddressUseCase(
            addressInMemoryRepository, 
        )

        await addressInMemoryRepository.create({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            idClinic: '152deda6-b234-4632-9200-50522635994c',
            street: 'street-faker',
            city: 'city-faker',
            complement: 'complement-faker',
            neighborhood: 'negihborhood-faker',
            num: 1,
            reference: 'reference-faker',
            state: 'state-faker',
            zip: 'zip-faker',
        })
    });

    test("Should be able to update a address", async () => {
       const {address} = await stu.execute({
            idClinic: '152deda6-b234-4632-9200-50522635994c',
            street: 'street-faker1',
            city: 'city-faker',
            complement: 'complement-faker',
            neighborhood: 'negihborhood-faker',
            num: 1,
            reference: 'reference-faker',
            state: 'state-faker',
            zip: 'zip-faker'
       })

       expect(address).toEqual(
        expect.objectContaining({
            street: 'street-faker1',
        })
       )
    });

    test("Should not be able to find a address with id invalid", async () => {
        await expect(()=> stu.execute({
            idClinic: '7881f50f-46dc-4b7d-b5d6-84bc924023e3',
            street: 'street-faker1',
            city: 'city-faker',
            complement: 'complement-faker',
            neighborhood: 'negihborhood-faker',
            num: 1,
            reference: 'reference-faker',
            state: 'state-faker',
            zip: 'zip-faker'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})