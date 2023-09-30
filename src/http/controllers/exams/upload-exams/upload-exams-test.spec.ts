import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { Clinic, Service, ServiceExecuted } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

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
        })

        const {id} = responseCreateServiceExecuted.body as ServiceExecuted
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'PACIENT',
        )

        const responseCreateExam = await request(fastifyApp.server)
        .post(`/api/exams/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('exams', './src/tmp/exams/ocular.png')
        .attach('exams', './src/tmp/exams/icon-javascript.png')

        expect(responseCreateExam.statusCode).toEqual(201)
        expect(responseCreateExam.body).toHaveLength(2)
        expect(responseCreateExam.body).toEqual([
            expect.objectContaining({
                urlExam: expect.any(String),
            }),
            expect.objectContaining({
                urlExam: expect.any(String),
            }),
        ])
    })

    test('should not be able to upload exams with invalid idServiceExecuted', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '67efda0f-d995-47e2-867f-5f9c9e88345a',
            'pacient@email.com',
            '123-456-789-10'
        )

        const fakeIdServiceExecuted = randomUUID()

        const responseCreateExam = await request(fastifyApp.server)
        .post(`/api/exams/${fakeIdServiceExecuted}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('exams', './src/tmp/exams/ocular.png')
        .attach('exams', './src/tmp/exams/icon-javascript.png')

        expect(responseCreateExam.statusCode).toEqual(404)
    })

    test('should not be able to upload exams with name file empty', async()=>{
        //criar service executed
        const {accessToken: accessTokenAdmin, user: userAdmin} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            'e04b54f4-f23e-4627-a0ab-ad3d60084eba',
            'user3@admin.com',
            '123-159-789-77'
        )

        // criar address
        await prisma.address.create({
            data: {
                id: 'c35da0a0-9dc8-4cdd-bfe4-0285feaab3c4',
                street: 'Rua Teste 1',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
            }
       })
       const idAddress = 'c35da0a0-9dc8-4cdd-bfe4-0285feaab3c4'

        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            address: {
                id:idAddress,
                street: 'Rua Teste 1',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Teste 2'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            name: 'Consulta teste 2',
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
            '2ef4588b-0a27-4d09-8d5d-8ea39a017c33',
            'pacient2@email.com',
            '123-456-789-33'
        )

        const responseCreateExams = await request(fastifyApp.server)
        .post(`/api/exams/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('', '')

        expect(responseCreateExams.statusCode).toEqual(400)
    })

    test('should not be able to upload exams with service executed already approved', async()=>{
        //criar service executed
        const {accessToken: accessTokenAdmin, user: userAdmin} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            randomUUID(),
            'jaine@gmail.com',
            '975.614.080-13'
        )


        const responseCreateClinic = await request(fastifyApp.server)
        .post(`/api/clinics`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            address: {
                id:'53fc1777-97d9-409c-b0bd-4d2d5a47cd40',
                street: 'Rua Teste',
                num: 123,
                complement: 'Complemento Teste',
                city: 'São Paulo',
                state: 'SP',
                zip: '12345678',
                neighborhood: 'Bairro Teste',
                reference: 'Referencia Teste',
                },
                name: 'Clinica Teste 7'
        })

        const {id: idClinic} = responseCreateClinic.body as Clinic

        // criar service
        const responseCreateService = await request(fastifyApp.server)
        .post(`/api/services`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({
            name: 'Consulta teste 7',
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
        })

        const {id} = responseCreateServiceExecuted.body as ServiceExecuted
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'PACIENT',
            randomUUID(),
            'user8@test.com',
            '123-456-789-88'
        )

        await request(fastifyApp.server)
        .post(`/api/exams/${id}/approve`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('exams', './src/tmp/exams/ocular.png')
        .attach('exams', './src/tmp/exams/icon-javascript.png')


        const responseApprovedServiceExecuted = await request(fastifyApp.server)
        .patch(`/api/services-executeds/${id}/approve`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send()

        const responseCreateExam = await request(fastifyApp.server)
        .post(`/api/exams/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('exams', './src/tmp/exams/ocular.png')
        .attach('exams', './src/tmp/exams/icon-javascript.png')

        expect(responseCreateExam.statusCode).toEqual(401)
    })

})