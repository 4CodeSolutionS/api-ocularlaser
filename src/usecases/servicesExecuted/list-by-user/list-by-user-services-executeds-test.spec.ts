import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { hash } from "bcrypt";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ListServicesExecutedByUserUseCases } from "./list-by-user-services-executeds-usecases";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";

let cardRepositoryInMemory: InMemoryCardRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let paymentRepositoryInMemory: InMemoryPaymentRepository;
let stu: ListServicesExecutedByUserUseCases;

describe("List service executed by user (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
        )
        stu = new ListServicesExecutedByUserUseCases(
            serviceExecutedRepositoryInMemory,
            usersRepositoryInMemory
        )

    });

    test("Should be able to list a service executed with idUser", async () => {
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

        for(let i = 1; i < 23; i++){
            await serviceExecutedRepositoryInMemory.create({
                id: `e1595d4f-a68e-49a5-aeae-02267fb4270${i}`,
                idUser: user.id,
                idClinic: clinic.id,
                idService: service.id,
                price: 500,
            })
        }

        const servicesExecuteds = await stu.execute({
            page: 2,
            idUser: user.id
        })
            expect(servicesExecuteds.length).toBe(2)
            expect(servicesExecuteds).toEqual([
                expect.objectContaining({
                    id: "e1595d4f-a68e-49a5-aeae-02267fb427021",
                }),
                expect.objectContaining({
                    id: "e1595d4f-a68e-49a5-aeae-02267fb427022",
                })
            ])
    });

    test("Should not be able to list a service executed with idUser invalid", async () => {
        const fakeId = "9c3dff89-03bc-4477-aa5d-67021af86354"

        await expect(()=> stu.execute({
            page: 2,
            idUser: fakeId
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
})