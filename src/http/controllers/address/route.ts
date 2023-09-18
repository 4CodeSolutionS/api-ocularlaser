import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FindAddress } from "./find/find-addresses-controller";
import { UpdateAddress } from "./update-full/update-addresses-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function addressRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))
    
    //find address
    fastifyApp.get('/:idClinic', FindAddress)

    //update address
    fastifyApp.put('/', UpdateAddress)

}
