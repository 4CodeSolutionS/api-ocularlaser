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

        await clinicRepositoryInMemory.create({
            id: 'a9eaf0ce-c646-42ac-8d6b-d8c66209d738',
            idAddress: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
            name: 'Clinica Zen'
        })

    });

    test("Should be able to update a clinic", async () => {
       const {clinic} = await stu.execute({
            id: '16e1d956-71fd-4dac-8b3b-d4147bff4909',
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
        expect(()=> stu.execute({
         id: 'a9eaf0ce-c646-42ac-8d6b-d8c66209d738',
         name: 'Clinica Kaiser'
         })).rejects.toBeInstanceOf(ClinicAlreadyExistsError)
     });
})