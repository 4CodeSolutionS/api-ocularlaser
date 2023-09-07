import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { UpdateClinicUseCase } from "./update-clinics-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ClinicAlreadyExistsError } from "@/usecases/errors/clinic-already-exists-error";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: UpdateClinicUseCase;

describe("Update clinic (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        stu = new UpdateClinicUseCase(
            clinicRepositoryInMemory, 
        )

        await clinicRepositoryInMemory.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
                name: 'Clinica Kaiser',
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

    test("Should be able to update a clinic", async () => {
       const {clinic} = await stu.execute({
            id: '152deda6-b234-4632-9200-50522635994c',
            name: 'Clinica Spot'
       })

       expect(clinic).toEqual(
        expect.objectContaining({
            name: 'Clinica Spot',
        })
       )
    });

    test("Should not be able to update a clinic with invalid id", async () => {
       expect(()=> stu.execute({
        id: '16a1d956-71fd-4dac-8b3b-d4147bff4909',
        name: 'Clinica Spot'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should not be able to update a clinic with name already exists", async () => {
        await expect(()=> stu.execute({
         id: '152deda6-b234-4632-9200-50522635994c',
         name: 'Clinica Kaiser'
         })).rejects.toBeInstanceOf(ClinicAlreadyExistsError)
     });
})