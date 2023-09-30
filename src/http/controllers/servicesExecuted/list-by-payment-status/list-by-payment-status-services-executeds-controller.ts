import { makeListServiceExecutedByPaymentStatus } from '@/usecases/factories/servicesExecuted/make-list-by-payment-status-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListServiceExecutedByPaymentStatus (request: FastifyRequest, reply:FastifyReply){
    try {
            const serviceSchemaQuery = z.object({
                page: z.string().transform(Number).optional(),
                status: z.enum(['APPROVED', 'REPROVED']),
            })

            const { 
                page,
                status
            } = serviceSchemaQuery.parse(request.query)

            const listServiceExecutedByPaymentStatusUseCase = await makeListServiceExecutedByPaymentStatus()
            
            const listServiceExecuted = await listServiceExecutedByPaymentStatusUseCase.execute({status, page})
            
            return reply.status(200).send(listServiceExecuted)
            
          } catch (error) {
            throw error
          }
}
    
