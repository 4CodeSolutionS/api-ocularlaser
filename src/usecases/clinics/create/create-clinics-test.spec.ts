import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { CreateClinicUseCase } from "./create-clinics-usecase";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: CreateClinicUseCase;

describe("Create clinic (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        stu = new CreateClinicUseCase(
            clinicRepositoryInMemory, 
        )

        await addressInMemoryRepository.create({
            id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
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

    test("Should be able to create a clinic", async () => {
       const {clinic} = await stu.execute({
            idAddress: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            name: 'Clinica Kaiser'
       })

       expect(clinic).toEqual(
        expect.objectContaining({
            name: 'Clinica Kaiser',
        })
       )
    });
})