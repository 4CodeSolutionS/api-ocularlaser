import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe.skip('Verify e-mail User (e2e)', ()=>{
    beforeEach(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        vi.useFakeTimers()
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

    test('should not be able to verify e-mail user with wrong email', async()=>{
        const token = 'fake-token'
        const email = 'fake-email'
        const response = await request(fastifyApp.server)
        .post(`/api/users/verify-email?email=${email}&token=${token}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })

    test.skip('should not be able to verify e-mail user with token expired', async()=>{
        vi.setSystemTime( new Date(2023, 10, 23, 7, 0, 0))
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

        vi.setSystemTime( new Date(2023, 10, 23, 10, 0, 0))
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${email}&token=${token}`)
        .send()

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id
            }
        })
        expect(response.statusCode).toEqual(401)
        // expect(user).toEqual(
        //     expect.objectContaining({
        //         emailActive: false
        //     })
        // )
    })

})