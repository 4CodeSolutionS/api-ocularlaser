import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/veiryf-user-role";
import { FindAddress } from "./find/find-addresses-controller";
import { UpdateAddress } from "./update-full/update-addresses-controller";

export async function addressRoutes(fastifyApp: FastifyInstance) {
    // fastifyApp.addHook('onRequest', verifyTokenJWT)
    // fastifyApp.addHook('onRequest', verifyUserRole("ADMIN"))
    
    //create address
    // fastifyApp.post('/', CreateAddress)  
    
    //find address
    fastifyApp.get('/:idClinic', FindAddress)

    //update address
    fastifyApp.put('/', UpdateAddress)

}
