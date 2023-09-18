import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Key } from "@prisma/client";
import { randomUUID } from "crypto";
import exp from "constants";

describe('Acess Admin User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to access admin a user', async()=>{
        const {accessToken, user:{id}} = await createAndAuthenticateUser(
            fastifyApp, 
            'SUPER',
            )

        const {user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT', 
            randomUUID(),
            'pacient@email.com',
            '123-456-789-00'
            )

        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(200)
        expect(responseAccessAdmin.body).toEqual(
            expect.objectContaining({
                role: 'ADMIN'
            })
        )
    })

    test('should not be able to access admin a user with invalid idUser', async()=>{
        const {accessToken, user:{id}} = await createAndAuthenticateUser(
            fastifyApp, 
            'SUPER',
            randomUUID(),
            'super2@email.com',
            '123-456-789-01'
            )

        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: randomUUID(),
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(404)
    })

    test('should not be able to access admin a user with key invalid', async()=>{
        const {accessToken, user:{id}} = await createAndAuthenticateUser(
            fastifyApp, 
            'SUPER',
            randomUUID(),
            'super1@email.com',
            '123-456-789-02'
            )

        const {user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT', 
            randomUUID(),
            'pacient2@email.com',
            '123-456-789-03'
            )

       const fakeKey = randomUUID()

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key: fakeKey
        })

        expect(responseAccessAdmin.statusCode).toEqual(404)
    })

    test('should not be able to access admin a user with key already active', async()=>{
        const {accessToken, user:{id}} = await createAndAuthenticateUser(
            fastifyApp, 
            'SUPER',
            randomUUID(),
            'super4@email.com',
            '123-456-789-99'
            )

        const {user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT', 
            randomUUID(),
            'pacient4@email.com',
            '123-456-789-88'
            )

        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(401)
    })
})