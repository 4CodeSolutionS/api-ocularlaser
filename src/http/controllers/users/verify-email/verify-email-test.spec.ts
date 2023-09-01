import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Verify e-mail User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to verify e-mail a user', async()=>{
        const responseUser = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })

        const {id, email} = responseUser.body as User

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${email}&token=${token}`)
        .send()

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id
            }
        })
        expect(response.statusCode).toEqual(200)
        expect(user).toEqual(
            expect.objectContaining({
                emailActive: true
            })
        )
        
    })

})