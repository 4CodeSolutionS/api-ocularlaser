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
    await prisma.user.create({
        data:{
            id: id ? id : randomUUID(),
            name:'marcelo do teste',
            email: email ? email : 'kaio.almeida@gmail.com',
            cpf: cpf ? cpf : "24971563792",
            gender: 'MASCULINO',
            phone: '4738010919',
            password: await hash('123456', 8),
            emailActive: false,
            role: role ? role : 'PACIENT',
        }
    })

    // autenticar usuario
    const response = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: email ? email : 'kaio.almeida@gmail.com',
            password: '123456',
        }) 
    const { accessToken, refreshToken, user} = response.body as IResponseLoginAccount
    
    // retornar acessToken, refreshToken e usuario
    return {
        user,
        accessToken,
        refreshToken
    }
}