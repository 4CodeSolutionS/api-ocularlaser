import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Clinic, Service, ServiceExecuted } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { randomUUID } from "node:crypto";

describe('Create Payments (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create payment credit_card unique', async()=>{
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
        // remoteIp
        //criar pagamento na asaas
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'CREDIT_CARD',
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
            remoteIp: "116.213.42.532"            
        })

         expect(responseCreateService.statusCode).toEqual(201)
    }, 100000)

    test('should be able to create payment credit_card installment', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'carll@gmail.gmail.com',
            '46201884840'
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
                name: 'Clinica Kaiser Test'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame',
            price: 500,
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
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'CREDIT_CARD',
            installmentCount: 12,
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
            remoteIp: "116.213.42.532"            
        })
         expect(responseCreateService.statusCode).toEqual(201)
    }, 100000)

    test('should be able to create payment pix', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'calpneu@gmail.com',
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
                name: 'Clinica Health Test'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame 1',
            price: 500,
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
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'PIX',
            remoteIp: "116.213.42.532"            
        })
         expect(responseCreateService.statusCode).toEqual(201)
    }, 100000)

    test('should be able to create payment boleto', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'calneu@gmail.com',
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
                name: 'Clinica Care Test'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame 2',
            price: 500,
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
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'FETLOCK',
            remoteIp: "116.213.42.532"            
        })
         expect(responseCreateService.statusCode).toEqual(201)
    }, 100000)

    test('should not be able to create payment with customer invalid', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'caline@gmail.com',
            '74125896355'
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
                name: 'Clinica Care Test 3'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame 4',
            price: 500,
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
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'FETLOCK',
            remoteIp: "116.213.42.532"            
        })
         expect(responseCreatePayment.statusCode).toEqual(400)
    }, 100000)

    test('should not be able to create payment with credit_card invalid', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'andre@gmail.com',
            '98765432100'
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
                name: 'Clinica Care Test 5'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta ocular + exame 5',
            price: 500,
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
        const responseCreatePayment = await request(fastifyApp.server)
        .post(`/api/payments`)
        .send({
            idUser: user.id,
            idServiceExecuted,
            billingType: 'CREDIT_CARD',
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
            remoteIp: "116.213.42.532"          
        })
         expect(responseCreatePayment.statusCode).toEqual(400)
    }, 100000)
})