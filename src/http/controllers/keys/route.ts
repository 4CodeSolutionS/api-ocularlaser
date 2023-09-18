import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { FastifyInstance } from "fastify"
import { CreateKey } from "./create/create-keys-controller"
import { ListKey } from "./list/list-keys-controller"

export async function keysRoutes(fastifyApp: FastifyInstance){
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('SUPER'))

    // criar key
    fastifyApp.post('/', CreateKey)

    // listar keys
    fastifyApp.get('/', ListKey)
}