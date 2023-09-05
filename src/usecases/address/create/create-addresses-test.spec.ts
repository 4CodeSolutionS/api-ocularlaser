import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { CreateAddressUseCase } from "./create-addresses-usecase";

let addressInMemoryRepository: InMemoryAddressesRepository;
let stu: CreateAddressUseCase;

describe("Find user (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        stu = new CreateAddressUseCase(
            addressInMemoryRepository, 
        )
    });

    test("Should be able to create a address", async () => {
       const {address} = await stu.execute({
            street: 'street-faker',
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
            street: 'street-faker',
        })
       )
    });
})