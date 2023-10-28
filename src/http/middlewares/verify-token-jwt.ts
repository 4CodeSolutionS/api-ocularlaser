import { env } from "@/env";
import { RedisInMemoryProvider } from "@/providers/CacheProvider/implementations/provider-redis-in-memory";
import { AppError } from "@/usecases/errors/app-error";
import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export interface IPayload {
    sub: string;
    role: Role;
}

export async function verifyTokenJWT(
    request: FastifyRequest,
    response: FastifyReply,
) {
    // destruturar do headers o toke
    const authHeader = request.headers.authorization;

    // validar no if pra ve se existe
    if (!authHeader) {
        throw new Error("Miss token");
    }
    // destruturar o token de dentro do authHeader
    const [, token] = authHeader.split(" ");
    // verificar no verify o token
    // retirar de dentro do verify o id do user que esta no token
    try {
        const { sub: idUser, role } = verify(token, env.JWT_SECRET_ACCESS_TOKEN) as IPayload;

        //[] verificar se o token existe na blacklist
        const storageInMemoryProvider = new RedisInMemoryProvider()

        const inBlackList = await storageInMemoryProvider.isTokenInBlackList(token)

        if(inBlackList){
            throw new AppError('Token inválido', 401)
        }
        // depois pesquisar em um método findbyid que vamos criar
        // adicionar idUser no request
        request.user = {
            id: idUser,
            role: role,
            token,
        };
    } catch(error) {
        throw error
    }
}
