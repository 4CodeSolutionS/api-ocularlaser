import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Clinic } from "@prisma/client";

describe('Update Address (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a address', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            address: {
                id: '777eea13-3d79-4a39-a4a7-904e08affab7',
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

       const {id} = responseCreateClinic.body as Clinic
 
        const response = await request(fastifyApp.server)
        .put(`/api/addresses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idClinic: id,
            street: 'Rua Testez',
            num: 1233,
            complement: 'Complemento Testez',
            city: 'São Pauloz',
            state: 'SPz',
            zip: '12345678z',
            neighborhood: 'Bairro Testez',
            reference: 'Referencia Testez',
        })
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to update a address with id invalid', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )

        const id = 'fd0c3fc4-c6de-45ac-82df-660d7310d6a0'

        const responseDeleteAddress = await request(fastifyApp.server)
        .put(`/api/addresses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idClinic: id,
            street: 'Rua Teste',
            num: 123,
            complement: 'Complemento Teste',
            city: 'São Paulo',
            state: 'SP',
            zip: '12345678',
            neighborhood: 'Bairro Teste',
            reference: 'Referencia Teste',
        })

        expect(responseDeleteAddress.statusCode).toEqual(404)
    })
})