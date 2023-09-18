import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('List Clinic (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list clinics', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
        )
        await prisma.clinic.create({
            data:{
                id: '777eea13-3d79-4a39-a4a7-904e08affab7',
                address:{
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
                id: 'a245f700-7c8a-43ca-8eae-49fc1e3cdb2b',
                address:{
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
        const responseListClinics = await request(fastifyApp.server)
        .get(`/api/clinics`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListClinics.statusCode).toEqual(200)
    })
})