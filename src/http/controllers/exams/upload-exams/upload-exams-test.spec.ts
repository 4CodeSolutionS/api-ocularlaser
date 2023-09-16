import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Clinic, Service, ServiceExecuted } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Upload exams (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to upload exams', async()=>{
        //criar service executed
        const {accessToken: accessTokenAdmin, user: userAdmin} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '7b606dce-5419-4f79-8540-6ed63deea125',
            'user@admin.test',
            '123-159-789-88'
        )

        // criar clinica
        await prisma.address.create({
            data: {
                id: '777eea13-3d79-4a39-a4a7-904e08affab7',
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
            }
       })
       const idAddress = '777eea13-3d79-4a39-a4a7-904e08affab7'

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            address: {
                id:idAddress,
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Teste'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            name: 'Consulta teste',
            price: 100,
            category: 'QUERY' 
        })
        const {id: idService} = responseCreateService.body as Service

        // criar service executed
        const responseCreateServiceExecuted = await request(fastifyApp.server)
        .post(`/api/services-executeds`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            user:{
                id: userAdmin.id
            },
            clinic: {
                id: idClinic
            },
            service: {
                id: idService
            },
            date: '2023-09-16T10:50:00.000Z',
            datePayment: '2023-09-16T10:50:00.000Z',
        })

        const {id} = responseCreateServiceExecuted.body as ServiceExecuted
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'PACIENT',
        )

        const responseFindClinic = await request(fastifyApp.server)
        .post(`/api/exams/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('exams', './src/tmp/exams/ocular.png')
        .attach('exams', './src/tmp/exams/icon-javascript.png')

        expect(responseFindClinic.statusCode).toEqual(201)
        expect(responseFindClinic.body).toHaveLength(2)
        expect(responseFindClinic.body).toEqual([
            expect.objectContaining({
                urlExam: expect.any(String),
            }),
            expect.objectContaining({
                urlExam: expect.any(String),
            }),
        ])
    })

})