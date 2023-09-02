import { prisma } from "@/lib/prisma";
import { IResponseLoginAccount } from "@/usecases/users/login/login-usecase";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
    fastifyApp: FastifyInstance, 
    role?: Role,  
    email?:string, 
    cpf?:string) {
    // criar usuario pelo prisma
    await prisma.user.create({
        data:{
            name:'user1',
            email: email ? email : 'user@test.com',
            cpf: cpf ? cpf : "12345678910",
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
    
    const { accessToken, refreshToken, user} = response.body as IResponseLoginAccount
    
    // retornar acessToken, refreshToken e usuario
    return {
        user,
        accessToken,
        refreshToken
    }
}