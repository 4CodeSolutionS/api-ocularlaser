import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Find Address (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to find a address', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )
        
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

        const responseFindAddress = await request(fastifyApp.server)
        .get(`/api/addresses/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(responseFindAddress.statusCode).toEqual(200)
    })

    test('should not be able to find a address with id invalid', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )
        
 
        const id = 'fd0c3fc4-c6de-45ac-82df-660d7310d6a0'

        const responseFindAddress = await request(fastifyApp.server)
        .get(`/api/addresses/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseFindAddress.statusCode).toEqual(404)
    })
})