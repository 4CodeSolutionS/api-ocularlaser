import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeListServiceExecutedByClinic } from '@/usecases/factories/servicesExecuted/make-list-by-clinic-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListServiceExecutedByClinic (request: FastifyRequest, reply:FastifyReply){
    try {
            const serviceSchemaQuery = z.object({
                page: z.string().transform(Number).optional(),
                idClinic: z.string().uuid()
            })

            const { 
                page,
                idClinic
            } = serviceSchemaQuery.parse(request.query)

            const listServiceExecutedByClinicUseCase = await makeListServiceExecutedByClinic()
            
            const listServiceExecuted = await listServiceExecutedByClinicUseCase.execute({idClinic, page})
            
            return reply.status(200).send(listServiceExecuted)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
