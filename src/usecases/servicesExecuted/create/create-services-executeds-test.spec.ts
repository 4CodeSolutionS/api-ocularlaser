import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { hash } from "bcrypt";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { CreateServiceExecutedUseCase } from "./create-services-executeds-usecases";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";

let cardRepositoryInMemory: InMemoryCardRepository;
let mailProviderInMemory: InMemoryMailProvider;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let paymentRepositoryInMemory: InMemoryPaymentRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let stu: CreateServiceExecutedUseCase;

describe("Create service executed (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        mailProviderInMemory = new InMemoryMailProvider()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
        )
        stu = new CreateServiceExecutedUseCase(
            serviceExecutedRepositoryInMemory,
            mailProviderInMemory,
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
        )

    });

    test("Should be able to create a service executed", async () => {
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

        const serviceExecuted = await stu.execute({
            idUser: user.id,
            idClinic: clinic.id,
            idService: service.id,
        })

        expect(serviceExecuted).toEqual(
            expect.objectContaining({
                id: expect.any(String),
            })
        )
    });

    test("Should not be able to create a service executed with clinic invalid", async () => {
        const user = await usersRepositoryInMemory.create({
        cpf: "123456789",
        email: "user1@test.com",
        name: "User Test",
        gender: "MASCULINO",
        phone: "123456789",
        password: await hash("123456", 8),
        })

        const service = await serviceRepositoryInMemory.create({
            name: "Service Test",
            category: "EXAM",
            price: 500,
        })

        expect(()=> stu.execute({
            idUser: user.id,
            idClinic: randomUUID(),
            idService: service.id,
        })).rejects.toBeInstanceOf(ResourceNotFoundError) 

    });

    test("Should be able to create a service executed with user invalid", async () => {
        const clinic = await clinicRepositoryInMemory.create({
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


        const service = await serviceRepositoryInMemory.create({
            name: "Service Test",
            category: "EXAM",
            price: 500,
        })

        expect(()=> stu.execute({
            idUser: randomUUID(),
            idClinic: clinic.id,
            idService: service.id,
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should be able to create a service executed with service invalid", async () => {
        const clinic = await clinicRepositoryInMemory.create({
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
            cpf: "123456789",
            email: "user1@test.com",
            name: "User Test",
            gender: "MASCULINO",
            phone: "123456789",
            password: await hash("123456", 8),
        })

        expect(()=> stu.execute({
            idUser: user.id,
            idClinic: clinic.id,
            idService: randomUUID(),
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
})