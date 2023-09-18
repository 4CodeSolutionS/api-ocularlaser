import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeAccessAdminUser } from '@/usecases/factories/users/make-access-admin-user-usecases'
import { makeFindUser } from '@/usecases/factories/users/make-find-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function AccessAdminUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                idUser: z.string().uuid().nonempty(),
                key: z.string().nonempty()
            })

            const { 
                idUser,
                key
            } = userSchema.parse(request.body)

            const acessAdminUserUseCase = await makeAccessAdminUser()
            
            const {user} = await acessAdminUserUseCase.execute({
                idUser,
                key
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
