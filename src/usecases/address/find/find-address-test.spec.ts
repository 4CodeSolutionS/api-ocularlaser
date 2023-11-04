import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { FindAddressUseCase } from "./find-address-usecase";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryDiscountCounponsRepository } from "@/repositories/in-memory/in-memory-discount-coupons-repository";
import { AppError } from "@/usecases/errors/app-error";

let addressInMemoryRepository: InMemoryAddressesRepository;
let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let stu: FindAddressUseCase;

describe("Find address (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository(discountCouponRepositoryInMemory)
        stu = new FindAddressUseCase(
            addressInMemoryRepository, 
        )

        await addressInMemoryRepository.create({
            id: 'd118f664-7b7e-4d84-84b6-0d54fd729536',
            idClinic: '152deda6-b234-4632-9200-50522635994c',
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

    test("Should be able to find a address", async () => {
       const {address} = await stu.execute({
            idClinic: '152deda6-b234-4632-9200-50522635994c'
       })

        expect(address).toEqual(
            expect.objectContaining({
                street: 'Rua 1',
            })
        )
    });

    test("Should not be able to find a address with id invalid", async () => {
        await expect( () => stu.execute({
                idClinic: '7881f50f-46dc-4b7d-b5d6-84bc924023e3'
            })
        ).rejects.toEqual(new AppError('Endereço não encontrado', 404))
    })
})