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

    });

    test("Should be able to list clinics", async () => {
       const {clinics} = await stu.execute()

       expect(clinics).toHaveLength(2)
       expect(clinics).toEqual([
        expect.objectContaining({
            name: 'Clinica Zen',
        }),
        expect.objectContaining({
            name: 'Clinica Kaiser',
        }),
       ])
    });
})