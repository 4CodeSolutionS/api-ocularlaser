import { env } from "@/env";
import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

interface IPayload {
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

        // depois pesquisar em um método findbyid que vamos criar
        // adicionar idUser no request
        request.user = {
            id: idUser,
            role: role as Role,
        };
    } catch {
        throw new Error("Invalid token");
    }
}
