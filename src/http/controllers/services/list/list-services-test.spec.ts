import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('List Service (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list all service', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )

        for(let i = 1; i < 11; i++){
            await request(fastifyApp.server)
            .post(`/api/services`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: `Consulta teste ${i}`,
                price: 100,
                category: 'QUERY' 
            })
        }

        const responseListService = await request(fastifyApp.server)
        .get(`/api/services`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()


        expect(responseListService.statusCode).toEqual(200)
        expect(responseListService.body.services.length).toEqual(10)
    })
})