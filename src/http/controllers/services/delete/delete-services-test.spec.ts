import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Service } from "@prisma/client";

describe('Delete Service (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a service', async()=>{
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

        const {id} = responseCreateService.body as Service

        const responseDeleteService = await request(fastifyApp.server)
        .delete(`/api/services/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteService.statusCode).toEqual(200)
    })

    test('should not be able to delete a service with invalid id', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '131.123.541-51'
        )

        const fakeId = '9d292a63-ec48-44d1-8b31-c7c9f9c97011'

        const responseDeleteService = await request(fastifyApp.server)
        .delete(`/api/services/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseDeleteService.statusCode).toEqual(404)
    })
})