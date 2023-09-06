import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Address } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('List Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list clinics', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )
        const responseCreateAddressFirst = await request(fastifyApp.server)
        .post(`/api/addresses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            street: 'Rua Teste',
            num: 123,
            complement: 'Complemento Teste',
            city: 'São Paulo',
            state: 'SP',
            zip: '12345678',
            neighborhood: 'Bairro Teste',
            reference: 'Referencia Teste',
        })

        const {id} = responseCreateAddressFirst.body as Address
        expect(responseCreateAddressFirst.statusCode).toEqual(201)

        const responseCreateAddressSecond = await request(fastifyApp.server)
        .post(`/api/addresses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            street: 'Rua Teste',
            num: 123,
            complement: 'Complemento Teste',
            city: 'São Paulo',
            state: 'SP',
            zip: '12345678',
            neighborhood: 'Bairro Teste',
            reference: 'Referencia Teste',
        })

        const {id: idAddressSecond} = responseCreateAddressSecond.body as Address
        expect(responseCreateAddressSecond.statusCode).toEqual(201)

        await request(fastifyApp.server)
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
            name: 'Clinica Teste 1'
        })

        await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                id: idAddressSecond,
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

        const responseListClinics = await request(fastifyApp.server)
        .get(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListClinics.statusCode).toEqual(200)
    })
})