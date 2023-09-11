import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeDeleteService } from '@/usecases/factories/services/make-delete-services-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteService (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = serviceSchemaParam.parse(request.params)

            const deleteServiceUseCase = await makeDeleteService()
            
             await deleteServiceUseCase.execute({
                id
            })
            
            return reply.status(200).send({message: 'Service deleted with success'})
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
