import { makeFindServiceExecuted } from '@/usecases/factories/servicesExecuted/make-find-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindServiceExecuted (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = serviceSchemaParam.parse(request.params)

            const findServiceExecutedUseCase = await makeFindServiceExecuted()
            
            const serviceExecuted = await findServiceExecutedUseCase.execute({
                id
            })
            
            return reply.status(200).send(serviceExecuted)
            
          } catch (error) {
            throw error
          }
}
    
