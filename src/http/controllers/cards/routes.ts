import { FastifyInstance } from "fastify";
import { DeleteCard } from "./delete/delete-cards-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FindCardByUser } from "./find-by-user/find-by-user-cards-controller";

export async function cardsRoutes(fastifyApp: FastifyInstance){
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // encontrar cartão pelo user
    fastifyApp.get('/:idUser', FindCardByUser)

    // deletar cartão
    fastifyApp.delete('/:id', DeleteCard)
}