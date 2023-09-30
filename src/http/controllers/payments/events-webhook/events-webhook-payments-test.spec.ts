import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { ServiceExecuted, Service, Clinic, Payment } from "@prisma/client";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { IAsaasPayment } from "@/usecases/payments/create/create-payment-usecases";
import { randomUUID } from "node:crypto";

describe('Events Payments Webhook (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to receive payment with events PAYMENT_RECEIVED', async()=>{
        //criar pagamento na asaas
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

        // criar clinica
        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Zein Test'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService, name: serviceName} = responseCreateService.body as Service
        // criar service executed
        const responseCreateServiceExecuted = await request(fastifyApp.server)
        .post(`/api/services-executeds`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: user.id
            },
            clinic: {
                id: idClinic
            },
            service: {
                id: idService
            },
        })
        const {id: idServiceExecuted} = responseCreateServiceExecuted.body as ServiceExecuted
        //criar pagamento na asaas
        const responseCreatePaymentAsaas = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idServiceExecuted,
            billingType: 'PIX',
            remoteIp: "116.213.42.532"            
        })

        const {
            id,
            customer,
            value,
            netValue,
            description,
            billingType,
            invoiceUrl,
            installment,
            dueDate,
        } = responseCreatePaymentAsaas.body as IAsaasPayment

        const responseEventsPaymentWebhook = await request(fastifyApp.server)
        .post(`/api/payments/events-webhook-payments`)
        .send({
            event: 'PAYMENT_RECEIVED',
            payment: {
                id,
                customer,
                installment,
                value,
                netValue,
                description,
                billingType,
                invoiceUrl,
                externalReference: idServiceExecuted,
                paymentDate: dueDate,
            }
        })
        expect(responseEventsPaymentWebhook.statusCode).toEqual(200)
        expect(responseEventsPaymentWebhook.body.payment).toEqual(
            expect.objectContaining({
                paymentStatus: 'APPROVED'
            })
        )
    }, 100000)

    test('should be able to receive payment with events PAYMENT_REPROVED', async()=>{
        //criar pagamento na asaas
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'test@gmail.com',
            '12345678909'
        )

        // criar clinica
        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Zein Test 2'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame de vista',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService, name: serviceName} = responseCreateService.body as Service
        // criar service executed
        const responseCreateServiceExecuted = await request(fastifyApp.server)
        .post(`/api/services-executeds`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: user.id
            },
            clinic: {
                id: idClinic
            },
            service: {
                id: idService
            },
        })
        const {id: idServiceExecuted} = responseCreateServiceExecuted.body as ServiceExecuted
        //criar pagamento na asaas
        const responseCreatePaymentAsaas = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idServiceExecuted,
            billingType: 'PIX',
            remoteIp: "116.213.42.532"            
        })

        const {
            id,
            customer,
            value,
            netValue,
            description,
            billingType,
            invoiceUrl,
            installment,
            dueDate,
        } = responseCreatePaymentAsaas.body as IAsaasPayment

        const responseEventsPaymentWebhook = await request(fastifyApp.server)
        .post(`/api/payments/events-webhook-payments`)
        .send({
            event: 'PAYMENT_REPROVED',
            payment: {
                id,
                customer,
                installment,
                value,
                netValue,
                description,
                billingType,
                invoiceUrl,
                externalReference: idServiceExecuted,
                paymentDate: dueDate,
            }
        })
        expect(responseEventsPaymentWebhook.statusCode).toEqual(200)
        expect(responseEventsPaymentWebhook.body).toEqual(
            expect.objectContaining({
                paymentStatus: 'REPROVED'
            })
        )
    }, 100000)

    test('should not be able to receive payment events different PAYMENT_REPROVED and PAYMENT_RECEIVED ', async()=>{
        //criar pagamento na asaas
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'test3@gmail.com',
            '52998224725'
        )

        // criar clinica
        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Zein Test 3'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame de vista 3',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService, name: serviceName} = responseCreateService.body as Service
        // criar service executed
        const responseCreateServiceExecuted = await request(fastifyApp.server)
        .post(`/api/services-executeds`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            user:{
                id: user.id
            },
            clinic: {
                id: idClinic
            },
            service: {
                id: idService
            },
        })
        const {id: idServiceExecuted} = responseCreateServiceExecuted.body as ServiceExecuted
        //criar pagamento na asaas
        const responseCreatePaymentAsaas = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idServiceExecuted,
            billingType: 'PIX',
            remoteIp: "116.213.42.532"            
        })

        const {
            id,
            customer,
            value,
            netValue,
            description,
            billingType,
            invoiceUrl,
            installment,
            dueDate,
        } = responseCreatePaymentAsaas.body as IAsaasPayment

        const responseEventsPaymentWebhook = await request(fastifyApp.server)
        .post(`/api/payments/events-webhook-payments`)
        .send({
            event: 'PAYMENT_CREATED',
            payment: {
                id,
                customer,
                installment,
                value,
                netValue,
                description,
                billingType,
                invoiceUrl,
                externalReference: idServiceExecuted,
                paymentDate: dueDate,
            }
        })
        expect(responseEventsPaymentWebhook.statusCode).toEqual(200)
        expect(responseEventsPaymentWebhook.body).toEqual(
            expect.objectContaining({
                message: "Event not valid!"
            })
        )
    }, 100000)
})