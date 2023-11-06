import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Logout User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to logout a user', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1-dev@outlook.com',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user1-dev@outlook.com',
            password: '123456',
        })
        const {accessToken, refreshToken, user} = responseLogin.body
        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            refreshToken,
        })
        expect(responseLogout.statusCode).toEqual(200)
    })

    test('should not be able to logout a user invalid', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user21-dev@outlook.com',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.444.565-65',
        })

        const responseLogin = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'user21-dev@outlook.com',
            password: '123456',
        })
        const {accessToken} = responseLogin.body

        const responseLogout = await request(fastifyApp.server)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiYjliYWRiYzItMGMzYS00MmU5LThhNmEtNDRhZDEwZWQwYTdmIiwiZW1haWwiOiJrYWlvLWRldkBvdXRsb29rLmNvbSIsImlhdCI6MTY5OTEyNzI3MiwiZXhwIjoxNjk5NzMyMDcyLCJzdWIiOiJiOWJhZGJjMi0wYzNhLTQyZTktOGE2YS00NGFkMTBlZDBhN2YifQ.Qp-L5duVRvdG84tzfQ_9hwlEKrugq51Qit_JzNNUiyw',
        })

        expect(responseLogout.statusCode).toEqual(404)
    })

})