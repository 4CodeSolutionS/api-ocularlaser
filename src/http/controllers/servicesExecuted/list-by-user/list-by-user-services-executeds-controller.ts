import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeListServiceExecutedByClinic } from '@/usecases/factories/servicesExecuted/make-list-by-clinic-services-executeds-usecases'
import { makeListServiceExecutedByUser } from '@/usecases/factories/servicesExecuted/make-list-by-user-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListServiceExecutedByUser (request: FastifyRequest, reply:FastifyReply){
    try {
            const serviceSchemaQuery = z.object({
                page: z.string().transform(Number).optional(),
                idUser: z.string().uuid()
            })

            const { 
                page,
                idUser
            } = serviceSchemaQuery.parse(request.query)

            const listServiceExecutedByUserUseCase = await makeListServiceExecutedByUser()
            
            const listServiceExecuted = await listServiceExecutedByUserUseCase.execute({idUser, page})
            
            return reply.status(200).send(listServiceExecuted)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
