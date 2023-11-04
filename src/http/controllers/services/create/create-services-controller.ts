import { makeCreateService } from '@/usecases/factories/services/make-create-services-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateService (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaBody = z.object({
                name: z.string().min(4).nonempty(),
                price: z.number().positive(),
                category: z.enum(['QUERY', 'EXAM', 'SURGERY'])
            })

            const { 
                name,
                price,
                category
            } = serviceSchemaBody.parse(request.body)

            const createServiceUseCase = await makeCreateService()
            
            const {service} = await createServiceUseCase.execute({
                name,
                price,
                category
            })
            
            return reply.status(201).send(service)
            
          } catch (error) {
            throw error
          }
}
    
