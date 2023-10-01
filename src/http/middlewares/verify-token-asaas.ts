import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyAsaasToken(
    request: FastifyRequest,
    response: FastifyReply,
) {
    // destruturar do headers o toke
    const authHeader = request.headers;

    console.log(authHeader);

}