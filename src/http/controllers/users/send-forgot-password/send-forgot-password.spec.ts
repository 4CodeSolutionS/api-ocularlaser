import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import {  User } from "@prisma/client";

describe('Send email forgot password (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to send email with link for reset password', async()=>{
        const responseUser = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })

        const {email} = responseUser.body as User

        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset password with email wrong', async()=>{
        const response = await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: 'fake@email.com'
        })

        expect(response.statusCode).toEqual(404)
    })

})