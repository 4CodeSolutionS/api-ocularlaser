import { CreateService } from "@/http/controllers/services/create/create-services-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FastifyInstance } from "fastify";
import { DeleteService } from "./delete/delete-services-controller";
import { FindService } from "./find/find-services-controller";
import { ListService } from "./list/list-services-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function servicesRoutes(fastifyApp: FastifyInstance){
    // criar serviço
    fastifyApp.post('/',{
        onRequest:[verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')]
    }, CreateService)

    // find serviço
    fastifyApp.get('/:id', {
        onRequest:[verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')]
    }, FindService)

    // list serviço
    fastifyApp.get('/', ListService)

    //delete serviço
    fastifyApp.delete('/:id',{
        onRequest:[verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')]
    } ,DeleteService)
}