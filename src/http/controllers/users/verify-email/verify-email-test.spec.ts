import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Verify e-mail User (e2e)', ()=>{
    beforeAll(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test('should be able to verify e-mail a user', async()=>{
        const {user} = await createAndAuthenticateUser(fastifyApp)

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(200)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: true
            })
        )
        
    })

    test('should not be able to verify e-mail user with wrong email', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "d86db2b4-88da-4778-82ce-6e42c2ae6530",
            'user2@email.com',
            '124.546.159-40',
            )

        const response = await request(fastifyApp.server)
        .post(`/api/users/verify-email?email=${user.email}&token=${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to verify e-mail a user with invalid token', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "0f3f1626-fe39-4cc1-8a41-d95f84d7148e",
            'user3@email.com',
            '123.546.159-40',
            )

        const token = "xxx"

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(404)
    })

})