import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeFindService } from '@/usecases/factories/services/make-find-services-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindService (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = serviceSchemaParam.parse(request.params)

            const findServiceUseCase = await makeFindService()
            
            const service = await findServiceUseCase.execute({
                id
            })
            
            return reply.status(200).send(service)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
