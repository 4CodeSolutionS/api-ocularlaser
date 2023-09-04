import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { FindAddressUseCase } from "./find-address-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let addressInMemoryRepository: InMemoryAddressesRepository;
let stu: FindAddressUseCase;

describe("Find address (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        stu = new FindAddressUseCase(
            addressInMemoryRepository, 
        )

        await addressInMemoryRepository.create({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            street: 'street-faker',
            city: 'city-faker',
            complement: 'complement-faker',
            negihborhood: 'negihborhood-faker',
            num: 1,
            reference: 'reference-faker',
            state: 'state-faker',
            zip: 'zip-faker',
        })
    });

    test("Should be able to find a address", async () => {
       const {address} = await stu.execute({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4'
       })

        expect(address).toEqual(
            expect.objectContaining({
                street: 'street-faker',
            })
        )
    });

    test("Should not be able to find a address with id invalid", async () => {
        await expect( () => stu.execute({
                id: '7881f50f-46dc-4b7d-b5d6-84bc924023e3'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})