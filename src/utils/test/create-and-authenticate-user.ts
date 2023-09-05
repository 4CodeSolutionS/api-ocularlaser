import { prisma } from "@/lib/prisma";
import { IResponseLoginAccount } from "@/usecases/users/login/login-usecase";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
    fastifyApp: FastifyInstance, 
    role?: Role,  
    id?: string,
    email?:string, 
    cpf?:string) {
<<<<<<< HEAD
    // criar usuario pelo prisma
=======
>>>>>>> development
    await prisma.user.create({
        data:{
            id: id ? id : randomUUID(),
            name:'user1',
            email: email ? email : 'user@test.com',
<<<<<<< HEAD
            cpf: cpf ? cpf : "12345678910",
=======
            cpf: cpf ? cpf : "123.456.789-10",
>>>>>>> development
            gender: 'MASCULINO',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
            emailActive: false,
            role: role ? role : 'PACIENT',
        }
    })

    // autenticar usuario
    const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: email ? email : 'user@test.com',
            password: '123456',
        }) 
<<<<<<< HEAD
    
=======
>>>>>>> development
    const { accessToken, refreshToken, user} = response.body as IResponseLoginAccount
    
    // retornar acessToken, refreshToken e usuario
    return {
        user,
        accessToken,
        refreshToken
    }
}