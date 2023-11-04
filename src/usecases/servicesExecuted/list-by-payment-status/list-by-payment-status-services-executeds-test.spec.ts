import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { hash } from "bcrypt";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { ListServiceExecutedByPaymentStatusUseCase } from "./list-by-payment-status-services-executeds-usecase";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { InMemoryDiscountCounponsRepository } from "@/repositories/in-memory/in-memory-discount-coupons-repository";

let mailProviderInMemory: InMemoryMailProvider;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let paymentRepositoryInMemory: InMemoryPaymentRepository;
let cardRepositoryInMemory: InMemoryCardRepository;
let discountCouponRepositoryInMemory: InMemoryDiscountCounponsRepository;
let stu: ListServiceExecutedByPaymentStatusUseCase;

describe("List service executed by clinic (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        mailProviderInMemory = new InMemoryMailProvider()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        discountCouponRepositoryInMemory = new InMemoryDiscountCounponsRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository(discountCouponRepositoryInMemory)
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
        )
        stu = new ListServiceExecutedByPaymentStatusUseCase(
            serviceExecutedRepositoryInMemory,
        )

    });

    test("Should be able to list a service executed with payment status APPROVED", async () => {
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

            const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
                idClinic: clinic.id,
                idService: service.id,
                idUser: user.id,
                price: service.price,
            })

            for(let i = 1; i < 6; i++){
                const createdPaymentApproved = await paymentRepositoryInMemory.create({
                    idServiceExecuted: serviceExecuted.id,
                    idPaymentAsaas: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
                    idUser: user.id,
                    value: service.price,
                    netValue: service.price,
                    paymentMethod: "PIX",
                    paymentStatus: "APPROVED",
                    invoiceUrl: "https://www.invoiceUrl.com",
                    datePayment: new Date(),
                })

                // const createdPaymentReproved = await paymentRepositoryInMemory.create({
                //     idServiceExecuted: serviceExecuted.id,
                //     idPaymentAsaas: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
                //     idUser: user.id,
                //     value: Number(service.price),
                //     netValue: Number(service.price),
                //     paymentMethod: "PIX",
                //     paymentStatus: "REPROVED",
                //     invoiceUrl: "https://www.invoiceUrl.com",
                //     datePayment: new Date(),
                // })
            }
            
            const listServiceExecuted = await stu.execute({
                status: "APPROVED"
            })

            expect(listServiceExecuted).toHaveLength(5);
            expect(listServiceExecuted).toEqual([
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "APPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "APPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "APPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "APPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "APPROVED"
                    }),
                })
            ])
            
    });

    test("Should be able to list a service executed with payment status REPROVED", async () => {
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

            const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
                idClinic: clinic.id,
                idService: service.id,
                idUser: user.id,
                price: service.price,
            })

            for(let i = 1; i < 6; i++){
                const createdPaymentReproved = await paymentRepositoryInMemory.create({
                    idServiceExecuted: serviceExecuted.id,
                    idPaymentAsaas: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
                    idUser: user.id,
                    value: Number(service.price),
                    netValue: Number(service.price),
                    paymentMethod: "PIX",
                    paymentStatus: "REPROVED",
                    invoiceUrl: "https://www.invoiceUrl.com",
                    datePayment: new Date(),
                })
            }
            
            const listServiceExecuted = await stu.execute({
                status: "REPROVED"
            })

            expect(listServiceExecuted).toHaveLength(5);
            expect(listServiceExecuted).toEqual([
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "REPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "REPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "REPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "REPROVED"
                    }),
                }),
                expect.objectContaining({
                    payment: expect.objectContaining({
                        paymentStatus: "REPROVED"
                    }),
                })
            ])
            
    });
    
})