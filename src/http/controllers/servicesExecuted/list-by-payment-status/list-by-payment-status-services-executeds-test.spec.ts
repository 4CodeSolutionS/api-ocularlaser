import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { Clinic, Service, ServiceExecuted } from "@prisma/client";
import { IAsaasPayment } from "@/usecases/payments/create/create-payment-usecases";
import { randomUUID } from "node:crypto";
import { env } from "@/env";

describe('List Service Executed by PaymentStatus (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list a service executed by paymentStatus APPROVED', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

       const idAddress = '777eea13-3d79-4a39-a4a7-904e08affab7'

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                id: idAddress,
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Teste'
        })
        const {id: idClinic} = responseCreateClinic.body as Clinic
        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta teste',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService} = responseCreateService.body as Service
        // criar service executed
        for(let i = 1; i < 6; i++){
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

            // desestruturar id do service executed
            const {id: idServiceExecuted} = responseCreateServiceExecuted.body as ServiceExecuted


            // criar pagamento com id do service executed
            const responseCreatePayment = await request(fastifyApp.server)
            .post(`/api/payments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                serviceExecuted:{
                    id: idServiceExecuted
                },
                billingType: 'PIX',
            })
            const {
                id,
                customer,
                installment,
                value,
                netValue,
                description,
                billingType,
                invoiceUrl,
                dueDate,
            } = responseCreatePayment.body as IAsaasPayment

        const responseEventsPaymentWebhook = await request(fastifyApp.server)
        .post(`/api/payments/events-webhook-payments`)
        .set('asaas-access-token', `${env.ASAAS_ACCESS_KEY}`)
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
        }

        const page = 1
        const status = 'APPROVED'
        const responseListServiceExecutedByPaymentStatus = await request(fastifyApp.server)
        .get(`/api/services-executeds/payment-status?status=${status}&page=${page}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListServiceExecutedByPaymentStatus.statusCode).toEqual(200)
        expect(responseListServiceExecutedByPaymentStatus.body).toHaveLength(5)
    },10000)

    test('should be able to list a service executed by paymentStatus REPROVED', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'email3@test.com',
            '364.999.470-40'
        )

       

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                id: randomUUID(),
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Teste 2'
        })
        const {id: idClinic} = responseCreateClinic.body as Clinic
        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta teste 2',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService} = responseCreateService.body as Service
        // criar service executed
        for(let i = 1; i < 6; i++){
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

            // desestruturar id do service executed
            const {id: idServiceExecuted} = responseCreateServiceExecuted.body as ServiceExecuted


            // criar pagamento com id do service executed
            const responseCreatePayment = await request(fastifyApp.server)
            .post(`/api/payments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                serviceExecuted:{
                    id: idServiceExecuted
                },
                billingType: 'PIX',
            })
            const {
                id,
                customer,
                installment,
                value,
                netValue,
                description,
                billingType,
                invoiceUrl,
                dueDate,
            } = responseCreatePayment.body as IAsaasPayment

        const responseEventsPaymentWebhook = await request(fastifyApp.server)
        .post(`/api/payments/events-webhook-payments`)
        .set('asaas-access-token', `${env.ASAAS_ACCESS_KEY}`)
        .send({
            event: 'PAYMENT_REPROVED_BY_RISK_ANALYSIS',
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
        }

        const page = 1
        const status = 'REPROVED'
        const responseListServiceExecutedByPaymentStatus = await request(fastifyApp.server)
        .get(`/api/services-executeds/payment-status?status=${status}&page=${page}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListServiceExecutedByPaymentStatus.statusCode).toEqual(200)
        expect(responseListServiceExecutedByPaymentStatus.body).toHaveLength(5)
    },10000)
})