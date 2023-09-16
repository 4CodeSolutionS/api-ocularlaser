import { Role } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"


export function verifyUserRole(
    verifyToRole: Role, 
    verifyRoleAlternative?: Role ){
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const {role} = request.user
        if(role !== verifyToRole && role !== verifyRoleAlternative){
            return reply.status(401).send({message: "Unauthorized."})
        }
    }        
}