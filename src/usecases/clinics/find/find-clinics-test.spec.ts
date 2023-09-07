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

        await clinicRepositoryInMemory.create({
            id: '152deda6-b234-4632-9200-50522635994c',
                name: 'Clinica Zen',
                Address:{
                    create:{
                        street: 'Rua 1',
                        complement: 'Casa',
                        neighborhood: 'Bairro 1',
                        num: 1,
                        reference: 'Perto do mercado',
                        state: 'SP',
                        zip: '12345678',
                        city: 'São Paulo'
                    }
                },
        })
    });

    test("Should be able to find a clinic", async () => {
       const {clinic} = await stu.execute({
            id: '152deda6-b234-4632-9200-50522635994c'
       })

        expect(clinic).toEqual(
            expect.objectContaining({
                name: 'Clinica Zen',
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