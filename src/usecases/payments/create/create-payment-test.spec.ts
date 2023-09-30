import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { hash } from "bcrypt";
import { CreatePaymentUseCase } from "./create-payment-usecases";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { InMemoryAsaasProvider } from "@/providers/PaymentProvider/in-memory/in-memory-asaas-provider";
import { EventsWebHookPaymentsUseCases } from "../events-webhook/events-webhook-payments-usecases";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { PaymentAlreadyExistsError } from "@/usecases/errors/payment-already-exists-error";


let paymentRepositoryInMemory: InMemoryPaymentRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let asaasProviderInMemory: InMemoryAsaasProvider;
let dateProviderInMemory: DayjsDateProvider;
let storageProviderInMemory: FirebaseStorageProvider;
let eventPaymentWebHook: EventsWebHookPaymentsUseCases;
let mailProviderInMemory: InMemoryMailProvider
let stu: CreatePaymentUseCase;

export interface IDiscount {
    value: number
    dueDateLimitDays: number
    type: 'FIXED' | 'PERCENTAGE'
}
describe("Create payment (unit)", () => {
    beforeEach(async () => {
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
            )
        mailProviderInMemory = new InMemoryMailProvider()
        dateProviderInMemory = new DayjsDateProvider()
        storageProviderInMemory = new FirebaseStorageProvider()
        asaasProviderInMemory = new InMemoryAsaasProvider(dateProviderInMemory)
        eventPaymentWebHook = new EventsWebHookPaymentsUseCases(
            paymentRepositoryInMemory,
            serviceExecutedRepositoryInMemory,
            asaasProviderInMemory,
            mailProviderInMemory
            )
        stu = new CreatePaymentUseCase(
            usersRepositoryInMemory,
            asaasProviderInMemory,
            dateProviderInMemory,
            serviceExecutedRepositoryInMemory,
            paymentRepositoryInMemory,
        )

    });

    test("Should be able to create a payment to type credit_card unique", async () => {
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
            cpf: "24971563792",
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

        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: "53d7be14-3da4-4a36-9e68-f58cc40e0b6a",
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 500,
        })

        const creditCard = {
            holderName: "marcelo h almeida",
            number: "5162306219378829",
            expiryMonth: "05",
            expiryYear: "2024",
            ccv: "318",
        }

        const creditCardHolderInfo = {
            name: "Marcelo Henrique Almeida",
            email: "marcelo.almeida@gmail.com",
            cpfCnpj: "24971563792",
            postalCode: "89223-005",
            addressNumber: "277",
            addressComplement: "Casa",
            phone: "4738010919",
        }

        const createdPaymentCreditCard = await stu.execute({
            idServiceExecuted: serviceExecuted.id,
            billingType: "CREDIT_CARD",
            dueDate: '2023-09-21',
            creditCard,
            creditCardHolderInfo,
            remoteIp: '116.213.42.532',
        })
       expect(createdPaymentCreditCard.payment).toEqual(
              expect.objectContaining({
                billingType: "CREDIT_CARD",
                externalReference: "53d7be14-3da4-4a36-9e68-f58cc40e0b6a",
              })
       )
    }, 100000);

    test("Should be able to create a payment to type credit_card with installments", async () => {
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
            cpf: "24971563792",
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

        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: "53d7be14-3da4-4a36-9e68-f58cc40e0b6a",
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 500,
        })

        const creditCard = {
            holderName: "marcelo h almeida",
            number: "5162306219378829",
            expiryMonth: "05",
            expiryYear: "2024",
            ccv: "318",
        }

        const creditCardHolderInfo = {
            name: "Marcelo Henrique Almeida",
            email: "marcelo.almeida@gmail.com",
            cpfCnpj: "24971563792",
            postalCode: "89223-005",
            addressNumber: "277",
            addressComplement: "Casa",
            phone: "4738010919",
        }

        const createdPaymentCreditCard = await stu.execute({
            idServiceExecuted: serviceExecuted.id,
            billingType: "CREDIT_CARD",
            dueDate: '2023-09-21',
            creditCard,
            creditCardHolderInfo,
            installmentCount: 5,
            installmentValue: 100,
            remoteIp: '116.213.42.532',
        })
        expect(createdPaymentCreditCard.payment).toEqual(
              expect.objectContaining({
                billingType: "CREDIT_CARD",
                externalReference: "53d7be14-3da4-4a36-9e68-f58cc40e0b6a",
              })
        )
    }, 100000);

    test("Should be able to create a payment to type fetlock", async () => {
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
            cpf: "24971563792",
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

        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: "25a01254-4a31-4f56-b985-1858315a4b71",
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 500,
        })

       const discount = {
           value: 10,
           dueDateLimitDays: 10,
           type: "FIXED",
       } as IDiscount

       const createdPaymentFetlock = await stu.execute({
           idServiceExecuted: serviceExecuted.id,
           billingType: "FETLOCK",
           dueDate: '2023-09-21',
           remoteIp: '116.213.42.532',
       })
       expect(createdPaymentFetlock.payment).toEqual(
        expect.objectContaining({
              billingType: "BOLETO",
              externalReference: "25a01254-4a31-4f56-b985-1858315a4b71",
              invoiceUrl: expect.any(String),
        })
       )

    }, 100000);
            
    test("Should be able to create a payment to type pix", async () => {
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
            cpf: "24971563792",
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

        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: '8d868595-7580-4cde-a169-f65069aa4950',
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 500,
        })

   const createdPaymentPix = await stu.execute({
       idServiceExecuted: serviceExecuted.id,
       billingType: "PIX",
       description: 'compra teste de pix',
       remoteIp: '116.213.42.532',
   })
    expect(createdPaymentPix.payment).toEqual(
        expect.objectContaining({
            billingType: "PIX",
            externalReference: "8d868595-7580-4cde-a169-f65069aa4950",
            invoiceUrl: expect.any(String),
        })
    )
    
    }, 100000);

    test("Should not be able to create a payment with idServiceExecuted invalid", async () => {

    await expect(()=> stu.execute({
        idServiceExecuted: randomUUID(),
        billingType: "PIX",
        description: 'compra teste de pix',
        remoteIp: '116.213.42.532',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
    
    }, 100000);

    test("should not be able to payout payment already exists to same service executed", async () => {
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
            cpf: "24971563792",
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

        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: "53d7be14-3da4-4a36-9e68-f58cc40e0b6a",
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 500,
        })

        const creditCard = {
            holderName: "marcelo h almeida",
            number: "5162306219378829",
            expiryMonth: "05",
            expiryYear: "2024",
            ccv: "318",
        }

        const creditCardHolderInfo = {
            name: "Marcelo Henrique Almeida",
            email: "marcelo.almeida@gmail.com",
            cpfCnpj: "24971563792",
            postalCode: "89223-005",
            addressNumber: "277",
            addressComplement: "Casa",
            phone: "4738010919",
        }

        const {payment} = await stu.execute({
            idServiceExecuted: serviceExecuted.id,
            billingType: "CREDIT_CARD",
            dueDate: '2023-09-21',
            creditCard,
            creditCardHolderInfo,
            remoteIp: '116.213.42.532',
        })
        
        const confirmPayment = await eventPaymentWebHook.execute({
            event: 'PAYMENT_RECEIVED',
            payment: {
                id: payment.id,
                customer: payment.customer,
                invoiceUrl: payment.invoiceUrl,
                billingType: payment.billingType,
                externalReference: payment.externalReference,
                paymentDate: payment.dueDate,
                value: payment.value,
                netValue: payment.netValue,
                description: payment.description,
                installment: payment.installment,
            }
        })
        await expect(()=> stu.execute({
            idServiceExecuted: serviceExecuted.id,
            billingType: "CREDIT_CARD",
            dueDate: '2023-09-21',
            creditCard,
            creditCardHolderInfo,
            remoteIp: '116.213.42.532',
        })).rejects.toBeInstanceOf(PaymentAlreadyExistsError)

    }, 100000);
    
});