import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { hash } from "bcrypt";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { FindServicesExecutedUseCases } from "./find-services-executeds-usecases";
import { CreateServiceExecutedUseCase } from "../create/create-services-executeds-usecases";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { InMemoryDiscountCounponsRepository } from "@/repositories/in-memory/in-memory-discount-coupons-repository";
import { AppError } from "@/usecases/errors/app-error";

let mailProviderInMemory: InMemoryMailProvider;
let cardRepositoryInMemory: InMemoryCardRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let createServiceExecuted: CreateServiceExecutedUseCase;
let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository;
let paymentRepositoryInMemory: InMemoryPaymentRepository;
let stu: FindServicesExecutedUseCases;

describe("Find service executed (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        mailProviderInMemory = new InMemoryMailProvider()
        discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        clinicRepositoryInMemory = new InMemoryClinicRepository(discountCouponRepositoryInMemory)
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
        )
        createServiceExecuted = new CreateServiceExecutedUseCase(
            serviceExecutedRepositoryInMemory,
            mailProviderInMemory,
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
        )
        stu = new FindServicesExecutedUseCases(serviceExecutedRepositoryInMemory)

    });

    test("Should be able to find a service executed", async () => {
       const clinic = await clinicRepositoryInMemory.create({
            id: "9c3dff89-03bc-4477-aa5d-67021af86354",
            name: "Clinic Test",
            address:{
                create:{
                    city: "City Test",
                    neighborhood: "Neighborhood Test",
                    num: 1,
                    state: "State Test",
                    street: "Street Test",
                    zip: "Zip Test",
                    complement: "Complement Test",
                    reference: "Reference Test"
                }
            }
       })

         const user = await usersRepositoryInMemory.create({
            id: "98ed1021-c869-4b76-838e-c9beb900792c",
            cpf: "123456789",
            email: "user1@test.com",
            name: "User Test",
            gender: "MASCULINO",
            phone: "123456789",
            password: await hash("123456", 8),
         })

            const service = await serviceRepositoryInMemory.create({
                id: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
                name: "Service Test",
                category: "EXAM",
                price: 500,
            })

            const {id} = await createServiceExecuted.execute({
                idUser: user.id,
                idClinic: clinic.id,
                idService: service.id,
            })

            const serviceExecuted = await stu.execute({
                id
            })

            expect(serviceExecuted).toEqual(
                expect.objectContaining({
                    id
                })
            )
    });

    test("Should not be able to find a service executed with invalid id", async () => {
        const fakeId = 'e1595d4f-a68e-49a5-aeae-02267fb4270c'

        await expect(()=> stu.execute({
            id: fakeId
        })).rejects.toEqual(new AppError('Serviço executado não encontrado', 404))
 
    });

})