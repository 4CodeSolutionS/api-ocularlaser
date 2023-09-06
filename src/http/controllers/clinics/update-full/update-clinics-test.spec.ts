import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Address, Clinic } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Update Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a clinic', async()=>{
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

        const {id: idClinic} = responseCreateClinic.body as Clinic

        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: idClinic,
            name: 'Clinica Teste 10'
        })

        expect(responseUpdateClinic.statusCode).toEqual(200)
    })

    test('should not be able to update a clinic with invalid id', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            'f967289a-6145-4e0c-9935-6f932a6b0147',
            'user2@test.com',
            '147.157.123-50'
        )

        const fakeIdClinic = 'f967289a-6145-4e0c-9935-6f932a6b0147'
        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: fakeIdClinic,
            name: 'Clinica Teste 10'
        })

        expect(responseUpdateClinic.statusCode).toEqual(404)
    })

    test('should not be able to update a clinic with name already exists', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '777eea13-3d79-4a39-a4a7-904e08affab7',
            'user3@test.com',
            '147.157.123-51'
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
            name: 'Clinica Teste'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: idClinic,
            name: 'Clinica Kaiser'
        })

        expect(responseUpdateClinic.statusCode).toEqual(409)
    })
})