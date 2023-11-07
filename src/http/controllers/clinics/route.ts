import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { CreateClinic } from "./create/create-clinics-controller"
import { FastifyInstance } from "fastify"
import { FindClinic } from "./find/find-clinics-controller"
import { DeleteClinic } from "./delete/delete-clinics-controller"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"

export async function clinicsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))
    
    // create clinic
    fastifyApp.post('/', CreateClinic) 
    
    // find clinic
    fastifyApp.get('/:id', FindClinic)

    // delete clinic
    fastifyApp.delete('/:id', DeleteClinic)
}
