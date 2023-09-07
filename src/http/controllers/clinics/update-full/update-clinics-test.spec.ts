import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Address, Clinic } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Update Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a clinic', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )
        await prisma.clinic.create({
            data:{
                id: 'a245f700-7c8a-43ca-8eae-49fc1e3cdb2b',
                Address:{
                    create:{
                        street: 'Rua 1',
                        complement: 'Casa',
                        neighborhood: 'Bairro 1',
                        num: 1,
                        reference: 'Perto do mercado',
                        state: 'SP',
                        zip: '12345678',
                        city: 'São Paulo'
                    }
                    
                },
                name: 'Clinica Zen'
            }
        })

        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: 'a245f700-7c8a-43ca-8eae-49fc1e3cdb2b',
            name: 'Clinica Teste 10'
        })

        expect(responseUpdateClinic.statusCode).toEqual(200)
    })

    test('should not be able to update a clinic with invalid id', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            'f967289a-6145-4e0c-9935-6f932a6b0147',
            'user2@test.com',
            '147.157.123-50'
        )

        const fakeIdClinic = 'f967289a-6145-4e0c-9935-6f932a6b0147'
        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: fakeIdClinic,
            name: 'Clinica Teste 10'
        })

        expect(responseUpdateClinic.statusCode).toEqual(404)
    })

    test('should not be able to update a clinic with name already exists', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '777eea13-3d79-4a39-a4a7-904e08affab7',
            'user3@test.com',
            '147.157.123-51'
        )

        await prisma.clinic.create({
            data:{
                id: '777eea13-3d79-4a39-a4a7-904e08affab7',
                Address:{
                    create:{
                        street: 'Rua 1',
                        complement: 'Casa',
                        neighborhood: 'Bairro 1',
                        num: 1,
                        reference: 'Perto do mercado',
                        state: 'SP',
                        zip: '12345678',
                        city: 'São Paulo'
                    }
                    
                },
                name: 'Clinica Kaiser'
            }
        })

        await prisma.clinic.create({
            data:{
                id: '152deda6-b234-4632-9200-50522635994c',
                Address:{
                    create:{
                        street: 'Rua 1',
                        complement: 'Casa',
                        neighborhood: 'Bairro 1',
                        num: 1,
                        reference: 'Perto do mercado',
                        state: 'SP',
                        zip: '12345678',
                        city: 'São Paulo'
                    }
                    
                },
                name: 'Clinica Zen'
            }
        })

        const responseUpdateClinic = await request(fastifyApp.server)
        .put(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: '152deda6-b234-4632-9200-50522635994c',
            name: 'Clinica Kaiser'
        })

        expect(responseUpdateClinic.statusCode).toEqual(409)
    })
})