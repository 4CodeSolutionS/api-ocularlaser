import { FastifyInstance } from "fastify";
import { CreateAddress } from "./create/create-addresses-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/veiryf-user-role";
import { DeleteAddress } from "./delete/delete-addresses-controller";
import { FindAddress } from "./find/find-addresses-controller";

export async function addressRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole("ADMIN"))
    
    //create address
    fastifyApp.post('/', CreateAddress)  
    
    //find address
    fastifyApp.get('/:id', FindAddress)

    //delete address
    fastifyApp.delete('/:id', DeleteAddress)
}
