import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Delete User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a user', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(fastifyApp)
        const response = await request(fastifyApp.server)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to delete a user with invalid id', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            '528404fd-9b4d-43cd-a190-f9dd28f86540',
            'user2@test.com', 
            '134.684.456-01'
            )

        const fakeId = '70a2a313-3f71-4a01-8a64-ebf5b5ce23f2'

        const response = await request(fastifyApp.server)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })
})