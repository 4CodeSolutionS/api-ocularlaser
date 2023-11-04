import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { DeleteClinicUseCase } from "./delete-clinics-usecase";
import { Clinic } from "@prisma/client";
import { InMemoryDiscountCounponsRepository } from "@/repositories/in-memory/in-memory-discount-coupons-repository";
import { AppError } from "@/usecases/errors/app-error";

let addressInMemoryRepository: InMemoryAddressesRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository;
let stu: DeleteClinicUseCase;

describe("Delete clinic (unit)", () => {
    beforeEach(async () => {
        addressInMemoryRepository = new InMemoryAddressesRepository()
        discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository(discountCouponRepositoryInMemory)
        stu = new DeleteClinicUseCase(
            clinicRepositoryInMemory, 
        )

        await clinicRepositoryInMemory.create({
            id: '152deda6-b234-4632-9200-50522635994c',
                name: 'Clinica Zen',
                address:{
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

    test("Should be able to delete a clinic", async () => {
       await stu.execute({
            id: '152deda6-b234-4632-9200-50522635994c'
       })

      const findClinicExists = await clinicRepositoryInMemory.findById('152deda6-b234-4632-9200-50522635994c') as Clinic

        expect(findClinicExists).toEqual(null)
    });

    test("Should not be able to delete a clinic", async () => {
        const fakeId = '9ff379c1-4d49-483e-a4a3-5f897d54ec0c'        
        
        await expect(()=> stu.execute({
            id: fakeId
        })). rejects.toEqual(new AppError('Clinica não encontrada',404))
     });
})