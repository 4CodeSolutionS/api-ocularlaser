import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { Clinic } from "@prisma/client";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { FindClinicUseCase } from "./find-clinics-usecase";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: FindClinicUseCase;

describe("Find clinic (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        stu = new FindClinicUseCase(
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

        await clinicRepositoryInMemory.create({
            id: '16e1d956-71fd-4dac-8b3b-d4147bff4909',
            idAddress: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            name: 'Clinica Kaiser'
        })
    });

    test("Should be able to find a clinic", async () => {
       const {clinic} = await stu.execute({
            id: '16e1d956-71fd-4dac-8b3b-d4147bff4909'
       })

        expect(clinic).toEqual(
            expect.objectContaining({
                name: 'Clinica Kaiser',
            })
        )
    });

    test("Should not be able to find a clinic with invalid id", async () => {
        const fakeId = '9ff379c1-4d49-483e-a4a3-5f897d54ec0c'        
        
        await expect(()=> stu.execute({
            id: fakeId
        })). rejects.toBeInstanceOf(ResourceNotFoundError)
     });
})