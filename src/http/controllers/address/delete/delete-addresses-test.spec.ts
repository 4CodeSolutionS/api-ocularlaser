import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { User } from "@prisma/client";

describe('Delete Address (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a address', async()=>{
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

       const {id} = responseCreateAddress.body as User
 
        expect(responseCreateAddress.statusCode).toEqual(201)

        const responseDeleteAddress = await request(fastifyApp.server)
        .delete(`/api/addresses/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id
        })
        expect(responseDeleteAddress.statusCode).toEqual(200)
    })

    test('should not be able to delete a address with id invalid', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )
        
 
        const id = 'fd0c3fc4-c6de-45ac-82df-660d7310d6a0'

        const responseDeleteAddress = await request(fastifyApp.server)
        .delete(`/api/addresses/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteAddress.statusCode).toEqual(404)
    })
})