import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyAsaasToken(
    request: FastifyRequest,
    response: FastifyReply,
) {
    try {
        // destruturar do headers o toke
        const authHeader = request.headers['asaas-access-token'];

        if(!authHeader){
            throw new Error("Token not valid")
        }
    } catch (error) {
        throw new Error("Token not valid")
    }
}