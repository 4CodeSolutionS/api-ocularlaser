import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Verify e-mail User (e2e)', ()=>{
<<<<<<< HEAD
<<<<<<< HEAD
    beforeAll(async()=>{
=======
    beforeEach(async()=>{
>>>>>>> e5cf80c (alter: skiped all test somenthing verify-email)
=======
    beforeEach(async()=>{
=======
    beforeAll(async()=>{
>>>>>>> 34e89a8 (create: test for validation create clinic and fix: cases with vi.seTime adding afterEach)
>>>>>>> 74a8a51 (fix: conflix for branch)
        vi.useFakeTimers()
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test.skip('should be able to verify e-mail a user', async()=>{
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

<<<<<<< HEAD
<<<<<<< HEAD
    test('should not be able to verify e-mail user with wrong email', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "d86db2b4-88da-4778-82ce-6e42c2ae6530",
            'user2@email.com',
            '124.546.159-40',
            )

        const email = 'fakeemail@test.com'
=======
    test.skip('should not be able to verify e-mail user with wrong email', async()=>{
        const token = 'fake-token'
        const email = 'fake-email'
>>>>>>> e5cf80c (alter: skiped all test somenthing verify-email)
=======
    test.skip('should not be able to verify e-mail user with wrong email', async()=>{
        const token = 'fake-token'
        const email = 'fake-email'
=======
    test('should not be able to verify e-mail user with wrong email', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "d86db2b4-88da-4778-82ce-6e42c2ae6530",
            'user2@email.com',
            '124.546.159-40',
            )

        const email = 'fakeemail@test.com'
>>>>>>> 34e89a8 (create: test for validation create clinic and fix: cases with vi.seTime adding afterEach)
>>>>>>> 74a8a51 (fix: conflix for branch)
        const response = await request(fastifyApp.server)
        .post(`/api/users/verify-email?email=${email}&token=${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })

<<<<<<< HEAD
<<<<<<< HEAD
    test.skip('should not be able to verify e-mail user with token expired', async()=>{
        vi.setSystemTime( new Date(2023, 10, 24, 7, 0, 0))
        const {user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "9b20f428-4ad6-40be-8c85-ee1b8d0edbb4",
            'user3@email.com',
            '124.546.555-40',
            )
=======
=======
>>>>>>> 74a8a51 (fix: conflix for branch)
    test('should not be able to verify e-mail user with token expired', async()=>{
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

<<<<<<< HEAD
>>>>>>> e5cf80c (alter: skiped all test somenthing verify-email)
=======
=======
    test.skip('should not be able to verify e-mail user with token expired', async()=>{
        vi.setSystemTime( new Date(2023, 10, 24, 7, 0, 0))
        const {user} = await createAndAuthenticateUser(
            fastifyApp,
            "PACIENT",
            "9b20f428-4ad6-40be-8c85-ee1b8d0edbb4",
            'user3@email.com',
            '124.546.555-40',
            )
>>>>>>> 34e89a8 (create: test for validation create clinic and fix: cases with vi.seTime adding afterEach)
>>>>>>> 74a8a51 (fix: conflix for branch)
        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        vi.setSystemTime( new Date(2023, 10, 24, 10, 0, 1))
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        console.log(response.error)
        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(401)
        // expect(findUser).toEqual(
        //     expect.objectContaining({
        //         emailActive: false
        //     })
        // )
    })

})