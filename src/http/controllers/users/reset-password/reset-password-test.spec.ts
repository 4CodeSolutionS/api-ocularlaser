import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe.skip('Reset passowrd (e2e)', ()=>{
    beforeEach(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to reset password a user', async()=>{
        const {user} = await createAndAuthenticateUser(fastifyApp)

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567'
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset passowrd with token not valid', async()=>{
        const token = 'fake-token'
        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567798'
        })

        expect(response.statusCode).toEqual(404)
    })
})