import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { hash } from "bcrypt";
import { InMemoryPaymentRepository } from "@/repositories/in-memory/in-memory-payments-respository";
import { EventsWebHookPaymentsUseCases } from "./events-webhook-payments-usecases";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryAsaasProvider } from "@/providers/PaymentProvider/in-memory/in-memory-asaas-provider";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";

let paymentRepositoryInMemory: InMemoryPaymentRepository;
let asaasProviderInMemory: InMemoryAsaasProvider;
let usersRepositoryInMemory: InMemoryUsersRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let mailProviderInMemory: MailProvider;
let dateProviderInMemory: DayjsDateProvider;
let stu: EventsWebHookPaymentsUseCases;

export interface IDiscount {
    value: number
    dueDateLimitDays: number
    type: 'FIXED' | 'PERCENTAGE'
}
describe("Confirm payment received (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        dateProviderInMemory = new DayjsDateProvider()
        asaasProviderInMemory = new InMemoryAsaasProvider(dateProviderInMemory)
        mailProviderInMemory = new MailProvider()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory)
        stu = new EventsWebHookPaymentsUseCases(
            paymentRepositoryInMemory,
            serviceExecutedRepositoryInMemory,
            asaasProviderInMemory,
            mailProviderInMemory
        )

    });

    test("Should be able to confirm a payment unique", async () => {
        const clinic = await clinicRepositoryInMemory.create({
            id: randomUUID(),
            name: "Clinic Test 1",
            address:{
                create:{
                    id: randomUUID(),
                    city: "City Test1",
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
            email: "user11@test.com",
            name: "User Test1",
            gender: "MASCULINO",
            phone: "123456789",
            password: await hash("123456", 8),
        })
        const service = await serviceRepositoryInMemory.create({
            id: randomUUID(),
            name: "Surgey Test",
            category: "SURGERY",
            price: 230,
        })
        const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
            id: "1acafb98-7039-4c2c-bcb4-999b572d7b04",
            idClinic: clinic.id,
            idService: service.id,
            idUser: user.id,
            price: 230,
        })

        const customer = await asaasProviderInMemory.createCustomer({
            cpfCnpj: "24971563792",
            email: "user@test.com",
            name: "User Test",
            phone: "123456789",
        })
    
        const payment = await asaasProviderInMemory.createPayment({
            customer: customer.id,
            billingType: 'CREDIT_CARD',
            value: 230,
            dueDate: new Date().toISOString(),
            description: service.name,
            externalReference: "1acafb98-7039-4c2c-bcb4-999b572d7b04",
            remoteIp: "116.213.42.532",
        })

        const confirmPayment = await stu.execute({
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
                installment: payment.installments,
            }
        })
       
        expect(confirmPayment.payment).toEqual(
            expect.objectContaining({
                paymentMethod: 'CREDIT_CARD',
                invoiceUrl: 'https://invoice.com',
                paymentStatus: 'APPROVED'
            })
        )
          
    }, 100000);

    test("Should not be able to confirm a payment unique with status PAYMENT_REPROVED", async () => {
    const clinic = await clinicRepositoryInMemory.create({
        id: randomUUID(),
        name: "Clinic Test 1",
        address:{
            create:{
                id: randomUUID(),
                city: "City Test1",
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
        email: "user11@test.com",
        name: "User Test1",
        gender: "MASCULINO",
        phone: "123456789",
        password: await hash("123456", 8),
    })
    const service = await serviceRepositoryInMemory.create({
        id: randomUUID(),
        name: "Surgey Test",
        category: "SURGERY",
        price: 500,
    })
    const serviceExecuted = await serviceExecutedRepositoryInMemory.create({
        id: "1acafb98-7039-4c2c-bcb4-999b572d7b04",
        idClinic: clinic.id,
        idService: service.id,
        idUser: user.id,
        price: 500,
    })

    const customer = await asaasProviderInMemory.createCustomer({
        cpfCnpj: "24971563792",
        email: "user@test.com",
        name: "User Test",
        phone: "123456789",
    })

    const payment = await asaasProviderInMemory.createPayment({
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: 500,
        creditCard: {
            holderName: "marcelo h almeida",
            number: "5184019740373151",
            expiryMonth: "05",
            expiryYear: "2024",
            ccv: "318",
        },
        creditCardHolderInfo: {
            name: "Marcelo Henrique Almeida",
            email: "marcelo.almeida@gmail.com",
            cpfCnpj: "24971563792",
            postalCode: "89223-005",
            addressNumber: "277",
            addressComplement: "Casa",
            phone: "4738010919",
        },
        dueDate: new Date().toISOString(),
        description: 'description',
        externalReference: "1acafb98-7039-4c2c-bcb4-999b572d7b04",
        remoteIp: "116.213.42.532",
    })


    const confirmPayment = await stu.execute({
        event: 'PAYMENT_REPROVED',
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
                installment: payment.installments,
        }
    })

    expect(confirmPayment).toEqual(
        expect.objectContaining({
            paymentMethod: 'CREDIT_CARD',
            invoiceUrl: 'https://invoice.com',
            paymentStatus: 'REPROVED'
        })
    )
    }, 100000);

    test("Should be able to confirm a payment credi_card with installments", async () => {
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
        id: "b40bb36b-34a1-4d44-90bc-a867ebd7c355",
        idClinic: clinic.id,
        idService: service.id,
        idUser: user.id,
        price: 500,
    })

    const customer = await asaasProviderInMemory.createCustomer({
        cpfCnpj: "24971563792",
        email: "user@test.com",
        name: "User Test",
        phone: "123456789",
    })

    const payment = await asaasProviderInMemory.createPayment({
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: 500,
        dueDate: new Date().toISOString(),
        installmentCount: 5,
        installmentValue: 100,
        description: 'description',
        externalReference: "b40bb36b-34a1-4d44-90bc-a867ebd7c355",
        remoteIp: "116.213.42.532",
        creditCard: {
            holderName: "marcelo h almeida",
            number: "5162306219378829",
            expiryMonth: "05",
            expiryYear: "2024",
            ccv: "318",
        },
        creditCardHolderInfo: {
            name: "Marcelo Henrique Almeida",
            email: "marcelo.almeida@gmail.com",
            cpfCnpj: "24971563792",
            postalCode: "89223-005",
            addressNumber: "277",
            addressComplement: "Casa",
            phone: "4738010919",
        },
    })
    const confirmPayment = await stu.execute({
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
                installment: payment.installments,
        }
    })
    expect(confirmPayment.payment).toEqual(
        expect.objectContaining({
            paymentMethod: 'CREDIT_CARD',
            invoiceUrl: 'https://invoice.com',
            paymentStatus: 'APPROVED'
        })
    )
      
    }, 100000);

    test("Should not be able to confirm a payment credi_card with invalid idServiceExecuted", async () => {
        const customer = await asaasProviderInMemory.createCustomer({
            cpfCnpj: "24971563792",
            email: "user@test.com",
            name: "User Test",
            phone: "123456789",
        })
    
        const payment = await asaasProviderInMemory.createPayment({
            customer: customer.id,
            billingType: 'CREDIT_CARD',
            value: 500,
            dueDate: new Date().toISOString(),
            description: 'description',
            externalReference: randomUUID(),
            remoteIp: "116.213.42.532",
        })
        
        await expect(()=> stu.execute({
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
                installment: payment.installments,
            }
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    }, 100000);
});

    