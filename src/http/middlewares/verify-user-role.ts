import { Role } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"


export function verifyUserRole(
    verifyToleRoleOne: Role, 
    verifyToleRoleTwo?: Role,
    verifyToleRoleThree?: Role    
    ){
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const {role} = request.user
        if(role !== verifyToleRoleOne && role !== verifyToleRoleTwo && role !== verifyToleRoleThree){
            return reply.status(401).send({message: "Unauthorized."})
        }
    }        
}