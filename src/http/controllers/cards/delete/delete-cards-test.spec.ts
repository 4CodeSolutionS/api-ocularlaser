import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe('Delete Card (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a card', async()=>{
        await prisma.user.create({
            data:{
                id: 'f3efb169-9170-4b5e-92e3-f4891b6f7cea',
                cpf: '131.123.541-51',
                email:'email@test.com',
                gender: 'MASCULINO',
                name: 'User Test',
                phone: '77-99999-9999',
                password: '123456'
            }
        })
        const card = await prisma.card.create({
            data:{
                id: 'b3052dcd-2ce8-49cd-a7d7-5157d3b60761',
                idUser: 'f3efb169-9170-4b5e-92e3-f4891b6f7cea',
                ccv: '123',
                expireDate: '12/2022',
                name: 'User Test',
                num: '123456789',
            }
        })
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
        )

        const responseCreateService = await request(fastifyApp.server)
        .delete(`/api/cards/${card.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseCreateService.statusCode).toEqual(200)
    })

    test('should not be able to delete a service with invalid id', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            'ADMIN',
            '9d292a63-ec48-44d1-8b31-c7c9f9c97013',
            'user1@email.com',
            '123.456.498-50'
        )

        const cardFake = '0ea11e70-78bd-4c33-9136-32e182212b0a'

        const responseCreateService = await request(fastifyApp.server)
        .delete(`/api/cards/${cardFake}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseCreateService.statusCode).toEqual(404)
    })
})