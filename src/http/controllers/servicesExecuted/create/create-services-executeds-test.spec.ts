import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { Clinic, Service } from "@prisma/client";

describe('Create Service Executed (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a service executed', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

        // criar clinica
        await prisma.address.create({
            data: {
                id: '777eea13-3d79-4a39-a4a7-904e08affab7',
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
            }
       })
       const id = '777eea13-3d79-4a39-a4a7-904e08affab7'

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                id,
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
        expect(responseCreateServiceExecuted.statusCode).toEqual(201)
    })
})