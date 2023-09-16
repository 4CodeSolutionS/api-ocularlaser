import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeFindServiceExecuted } from '@/usecases/factories/servicesExecuted/make-find-services-executeds-usecases'
import { makeListServiceExecuted } from '@/usecases/factories/servicesExecuted/make-list-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListServiceExecuted (request: FastifyRequest, reply:FastifyReply){
    try {
            const serviceSchemaQuery = z.object({
                page: z.number().int().positive().optional(),
            })

            const { 
                page
            } = serviceSchemaQuery.parse(request.query)

            const listServiceExecutedUseCase = await makeListServiceExecuted()
            
            const listServiceExecuted = await listServiceExecutedUseCase.execute({page})
            
            return reply.status(200).send(listServiceExecuted)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
