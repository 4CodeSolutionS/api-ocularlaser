import { CreateService } from "@/http/controllers/services/create/create-services-controller";
import { verifyUserRole } from "@/http/middlewares/veiryf-user-role";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FastifyInstance } from "fastify";
import { DeleteService } from "./delete/delete-services-controller";
import { FindService } from "./find/find-services-controller";
import { ListService } from "./list/list-services-controller";

export async function servicesRoutes(fastifyApp: FastifyInstance){
     fastifyApp.addHook('onRequest', verifyTokenJWT)
     fastifyApp.addHook('onRequest', verifyUserRole("ADMIN"))

    // criar serviço
    fastifyApp.post('/', CreateService)

    // find serviço
    fastifyApp.get('/:id', FindService)

    // list serviço
    fastifyApp.get('/', ListService)

    //delete serviço
    fastifyApp.delete('/:id', DeleteService)
}