import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Register User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to register a user with CPF', async()=>{
        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1@olhalser.test',
            password: '123456',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
        })
            
        expect(response.statusCode).toEqual(201)
    })

})