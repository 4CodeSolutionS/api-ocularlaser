import { verifyUserRole } from "@/http/middlewares/veiryf-user-role"
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { CreateClinic } from "./create/create-clinics-controller"
import { FastifyInstance } from "fastify"
import { FindClinic } from "./find/find-clinics-controller"
import { DeleteClinic } from "./delete/delete-clinics-controller"
import { ListClinic } from "./list/list-clinics-controller"
import { UpdateClinic } from "./update-full/update-clinics-controller"

export async function clinicsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    // fastifyApp.addHook('onRequest', verifyUserRole("ADMIN"))
    
    // create clinic
    fastifyApp.post('/', CreateClinic) 
    
    // find clinic
    fastifyApp.get('/:id', FindClinic)

    // list clinics
    fastifyApp.get('/', ListClinic)

    // update clinic
    fastifyApp.put('/', UpdateClinic)

    // delete clinic
    fastifyApp.delete('/:id', DeleteClinic)
}
