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
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";
import { cryptingData } from "@/utils/crypting-data";
import { CreatePaymentUseCase } from "../create/create-payment-usecases";
import { InMemoryDiscountCounponsRepository } from "@/repositories/in-memory/in-memory-discount-coupons-repository";
import { AppError } from "@/usecases/errors/app-error";

let paymentRepositoryInMemory: InMemoryPaymentRepository;
let asaasProviderInMemory: InMemoryAsaasProvider;
let usersRepositoryInMemory: InMemoryUsersRepository;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let mailProviderInMemory: MailProvider;
let dateProviderInMemory: DayjsDateProvider;
let cardRepositoryInMemory: InMemoryCardRepository;
let createPaymentUseCase: CreatePaymentUseCase;
let discountCounposInMemory: InMemoryDiscountCounponsRepository;
let stu: EventsWebHookPaymentsUseCases;

export interface IDiscount {
    value: number
    dueDateLimitDays: number
    type: 'FIXED' | 'PERCENTAGE'
}

interface ICreditCard{
    holderName?: string,
    number?: string
    expiryMonth?: string
    expiryYear?: string
    ccv: string
}
describe("Confirm payment received (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        paymentRepositoryInMemory = new InMemoryPaymentRepository()
        discountCounposInMemory = new InMemoryDiscountCounponsRepository()
        clinicRepositoryInMemory = new InMemoryClinicRepository(discountCounposInMemory)
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        dateProviderInMemory = new DayjsDateProvider()
        asaasProviderInMemory = new InMemoryAsaasProvider(dateProviderInMemory)
        mailProviderInMemory = new MailProvider()
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
            paymentRepositoryInMemory
            )
        createPaymentUseCase = new CreatePaymentUseCase(
            usersRepositoryInMemory,
            asaasProviderInMemory,
            dateProviderInMemory,
            serviceExecutedRepositoryInMemory,
            paymentRepositoryInMemory,
            cardRepositoryInMemory,
        )
       
        stu = new EventsWebHookPaymentsUseCases(
            paymentRepositoryInMemory,
            serviceExecutedRepositoryInMemory,
            asaasProviderInMemory,
            cardRepositoryInMemory,
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

        const createdPaymentCreditCard = await createPaymentUseCase.execute({
            idServiceExecuted: "1acafb98-7039-4c2c-bcb4-999b572d7b04",
            billingType: "CREDIT_CARD",
            dueDate: '2023-09-21',
            creditCard,
            creditCardHolderInfo,
            remoteIp: '116.213.42.532',
        })
        const {payment} = createdPaymentCreditCard
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
                installment: payment.installment,
                creditCard: {creditCardToken: payment.creditCardToken as string},
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
        event: 'PAYMENT_REPROVED_BY_RISK_ANALYSIS',
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
    const brand = 'MASTER CARD'
    const {expiryMonth,expiryYear,holderName,number,ccv} = payment.creditCard as ICreditCard
    let criptData = []
    // criptografar dados do cartão
    for(let value of [number, holderName, `${expiryMonth}/${expiryYear}`, ccv, brand]){
        const valueCrypt = cryptingData(value as string)
        criptData.push(valueCrypt)
    }
    // salvar dados do cartão no banco de dados
    const card = await cardRepositoryInMemory.create({
            idUser: user.id,
            name: criptData[0] as string,
            num: criptData[1] as string,
            expireDate: criptData[2] as string,
            ccv: criptData[3] as string,
            brand: criptData[4] as string,
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
                installment: payment.installment,
                creditCard: {creditCardToken:payment.creditCardToken},
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
                installment: payment.installment,
            }
        })).rejects.toEqual(new AppError('Service Executed não encontrado', 404))
    }, 100000);
});

    