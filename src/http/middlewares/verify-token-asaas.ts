import { env } from "@/env";
import { AppError } from "@/usecases/errors/app-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyAsaasToken(
    request: FastifyRequest,
    response: FastifyReply,
) {
    try {
        //[x] destruturar do headers o token da asaas
        const authHeader = request.headers['asaas-access-token'];
        
        if(authHeader){
            throw new AppError("Token nao encontrado")
        }
        
        if(env.ASAAS_ACCESS_KEY !== authHeader){
            throw new AppError("Token invalido")
        }

        //[x] se não existir o token, retorna erro
    } catch (error) {
        throw new AppError("Token not valid")
    }
}