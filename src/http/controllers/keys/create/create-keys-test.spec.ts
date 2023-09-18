import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Create Key (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a key', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'SUPER',
        )
        
        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        
        expect(responseCreateKey.statusCode).toEqual(201)
    })
})