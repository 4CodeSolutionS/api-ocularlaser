import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyAsaasToken(
    request: FastifyRequest,
    response: FastifyReply,
) {
    try {
        //[x] destruturar do headers o token da asaas
        const authHeader = request.headers['asaas-access-token'];

        console.log(authHeader)

        //[x] se não existir o token, retorna erro
        if(!authHeader){
            throw new Error("Token not valid")
        }
    } catch (error) {
        throw new Error("Token not valid")
    }
}