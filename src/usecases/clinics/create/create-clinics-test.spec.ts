import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { CreateClinicUseCase } from "./create-clinics-usecase";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { Prisma } from "@prisma/client";
import { ClinicAlreadyExistsError } from "@/usecases/errors/clinic-already-exists-error";

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

    });

    test("Should be able to create a clinic", async () => {
       const {clinic} = await stu.execute({
            address: {
                id: '',
                idClinic: null,
                street: 'Rua 1',
                complement: 'Casa',
                neighborhood: 'Bairro 1',
                num: new Prisma.Decimal(123),
                reference: 'Perto do mercado',
                state: 'SP',
                zip: '12345678',
                city: 'São Paulo'
            },
            name: 'Clinica Kaiser'
       })

       expect(clinic).toEqual(
        expect.objectContaining({
            name: 'Clinica Kaiser',
        })
       )
    });

    test("Should not be able to create a clinic with name already exists", async () => {
        const {clinic} = await stu.execute({
             address: {
                 id: '',
                 idClinic: null,
                 street: 'Rua 1',
                 complement: 'Casa',
                 neighborhood: 'Bairro 1',
                 num: new Prisma.Decimal(123),
                 reference: 'Perto do mercado',
                 state: 'SP',
                 zip: '12345678',
                 city: 'São Paulo'
             },
             name: 'Clinica Kaiser'
        })
 
        await expect(()=> stu.execute({
            address: {
                id: '',
                idClinic: null,
                street: 'Rua 1',
                complement: 'Casa',
                neighborhood: 'Bairro 1',
                num: new Prisma.Decimal(123),
                reference: 'Perto do mercado',
                state: 'SP',
                zip: '12345678',
                city: 'São Paulo'
            },
            name: 'Clinica Kaiser'
       })).rejects.toBeInstanceOf(ClinicAlreadyExistsError)
     });


})