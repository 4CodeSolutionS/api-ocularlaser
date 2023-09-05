import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { DeleteAddressUseCase } from "./delete-address-usecase";

let addressInMemoryRepository: InMemoryAddressesRepository;
let stu: DeleteAddressUseCase;

describe("Delete address (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        stu = new DeleteAddressUseCase(
            addressInMemoryRepository, 
        )

        await addressInMemoryRepository.create({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
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

    test("Should be able to delete a address", async () => {
       await stu.execute({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4'
       })

        const findAddress = await addressInMemoryRepository.findById('7881f50f-46dc-4b7d-b5d6-84bc924023e4')
        expect(findAddress).toEqual(null)
    });

    test("Should not be able to find a address with id invalid", async () => {
        await expect( () => stu.execute({
                id: '7881f50f-46dc-4b7d-b5d6-84bc924023e3'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})