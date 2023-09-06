import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Address, Clinic } from "@prisma/client";

describe('Delete Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a clinic', async()=>{
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
        const responseDeleteClinic = await request(fastifyApp.server)
        .delete(`/api/clinics/${idClinic}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteClinic.statusCode).toEqual(200)
    })

    test('should not be able to delete a clinic with invalid id', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            'f967289a-6145-4e0c-9935-6f932a6b0147',
            'user3@test.com',
            '159.357.582-50'
        )

        const fakeId = 'f967289a-6145-4e0c-9935-6f932a6b0147'

        const responseFindClinic = await request(fastifyApp.server)
        .delete(`/api/clinics/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseFindClinic.statusCode).toEqual(404)
    })
})