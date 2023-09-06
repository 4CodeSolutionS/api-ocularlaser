import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { ListClinicsUseCase } from "./list-clinics-usecase";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: ListClinicsUseCase;

describe("List clinic (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        stu = new ListClinicsUseCase(
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
        await addressInMemoryRepository.create({
            id: '16e1d956-71fd-4dac-8b3b-d4147bff4909',
            street: 'Rua 2',
            complement: 'Casa',
            neighborhood: 'Bairro 2',
            num: 1,
            reference: 'Perto do mercado',
            state: 'SP',
            zip: '168786',
            city: 'São Paulo'
        })
        await clinicRepositoryInMemory.create({
            id: '4961d280-dfa3-4754-975c-e9f387cb2394',
            idAddress: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            name: 'Clinica Kaiser'
        })
        await clinicRepositoryInMemory.create({
            id: 'f4d3e418-4b4b-4a3a-a125-4429d0781b76',
            idAddress: '16e1d956-71fd-4dac-8b3b-d4147bff4909',
            name: 'Clinica Forma e Saude'
        })

    });

    test("Should be able to list clinics", async () => {
       const {clinics} = await stu.execute()

       expect(clinics).toHaveLength(2)
       expect(clinics).toEqual([
        expect.objectContaining({
            name: 'Clinica Kaiser',
        }),
        expect.objectContaining({
            name: 'Clinica Forma e Saude',
        }),
       ])
    });
})