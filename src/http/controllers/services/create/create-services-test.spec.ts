import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Create Service (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a service', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta teste',
            price: 100,
            category: 'QUERY' 
        })

        expect(responseCreateService.statusCode).toEqual(201)
    })

    test('should not be able to create a service with name already exists', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )

        await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta teste 1',
            price: 100,
            category: 'QUERY' 
        })

        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            name: 'Consulta teste 1',
            price: 100,
            category: 'QUERY' 
        })

        expect(responseCreateService.statusCode).toEqual(409)
    })
})