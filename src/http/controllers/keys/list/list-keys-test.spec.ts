import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('List Key (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list a key', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'SUPER',
        )
        
        for(let i = 1; i < 6; i++){
            await request(fastifyApp.server)
            .post(`/api/keys`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        }

        const responseListKeys = await request(fastifyApp.server)
        .get(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(responseListKeys.statusCode).toEqual(200)
        expect(responseListKeys.body).toHaveLength(5)
    })
})