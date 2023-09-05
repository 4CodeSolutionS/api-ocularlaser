import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe('Update User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a user', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            'dee2a509-b42d-4c80-a733-d76bce3a2fe0',
            'user4-dev@outlook.com',
            '102.222.333-50' 
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: user.id,
            name: 'Kaio Moreira',
            email: 'user5-dev@outlook.com',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })
            
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to update a user with id user invalid', async()=>{
        const {accessToken} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            '960670a5-8adc-4135-b624-07f5c856906b',
            'user15-dev@outlook.com', 
            '102.222.333-33' 
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: 'dee2a509-b42d-4c80-a733-d76bce3a2f10',
            name: 'Kaio Moreira',
            email: 'user11-dev@outlook.com',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })
            
        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to update a user with CPF alredy exists', async()=>{
        await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            '5ec8232f-b457-4693-9bdf-965ba2cb5413',
            'user65-dev@outlook.com', 
            '102.222.333-77' 
            )

        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            '4f504c29-1605-4ec8-b367-00d5874a08e1',
            'user25-dev@outlook.com', 
            '102.222.333-88' 
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: user.id,
            name: 'Kaio Moreira',
            email: 'user33-dev@outlook.com',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '102.222.333-77',
        })
            
        expect(response.statusCode).toEqual(401)
    })

    test('should not be able to update a user with Email alredy exists', async()=>{
        await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            'cd8e85a7-bf7d-4291-86f3-fec389b3582c',
            'user111-dev@outlook.com', 
            '102.222.333-44' 
            )

        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp, 
            'PACIENT',
            '35fbad92-bacf-45f8-bf41-85a9f1074181',
            'user11-dev@outlook.com', 
            '102.222.333-66' 
            )

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: user.id,
            name: 'Kaio Moreira',
            email: 'user111-dev@outlook.com',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '102.222.333-99',
        })
            
        expect(response.statusCode).toEqual(409)
    })
  
})