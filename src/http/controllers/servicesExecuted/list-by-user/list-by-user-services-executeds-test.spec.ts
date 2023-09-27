import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { Clinic, Service } from "@prisma/client";

describe('List Service Executed by User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list a service executed by user', async()=>{
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
        for(let i = 1; i < 23; i++){
            await request(fastifyApp.server)
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
        }
        const page = 1

        const responseListByUserServiceExecuted = await request(fastifyApp.server)
        .get(`/api/services-executeds/user?idUser=${user.id}&page=${page}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListByUserServiceExecuted.statusCode).toEqual(200)
        expect(responseListByUserServiceExecuted.body).toHaveLength(20)
    })

    test('should not be able to list a service executed by user with invalid idUser', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )

        const page = 1
        const fakeIdUser = '4977eeec-d965-4c18-8af8-ce4adbaca2fc'

        const responseListByUserServiceExecuted = await request(fastifyApp.server)
        .get(`/api/services-executeds/user?idUser=${fakeIdUser}&page=${page}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListByUserServiceExecuted.statusCode).toEqual(404)
    })
})