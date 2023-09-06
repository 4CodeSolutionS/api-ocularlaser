import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Address } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Create Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a clinic', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )
        const responseCreateAddress = await request(fastifyApp.server)
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

        const {id} = responseCreateAddress.body as Address
        expect(responseCreateAddress.statusCode).toEqual(201)

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

        expect(responseCreateClinic.statusCode).toEqual(201)
    })

    test('should not be able to create a clinic with name already exists', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            'f967289a-6145-4e0c-9935-6f932a6b0147',
            'user3@test.com',
            '159.357.582-50'
        )

        await prisma.address.create({
            data:{
                id: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
                street: 'Rua 1',
                complement: 'Casa',
                neighborhood: 'Bairro 1',
                num: 1,
                reference: 'Perto do mercado',
                state: 'SP',
                zip: '12345678',
                city: 'São Paulo'
            }
        })

        await prisma.clinic.create({
            data:{
                id: '16e1d956-71fd-4dac-8b3b-d4147bff4909',
                idAddress: '7881f50f-46dc-4b7d-b5d6-84bc924023e4',
                name: 'Clinica Kaiser'
            }
        })

        const responseCreateAddress = await request(fastifyApp.server)
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

        const {id} = responseCreateAddress.body as Address
        expect(responseCreateAddress.statusCode).toEqual(201)

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
            name: 'Clinica Kaiser'
        })

        expect(responseCreateClinic.statusCode).toEqual(409)
    })
})