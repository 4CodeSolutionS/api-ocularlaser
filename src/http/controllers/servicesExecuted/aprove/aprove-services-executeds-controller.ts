import { makeAproveServiceExecuted } from '@/usecases/factories/servicesExecuted/make-aprove-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function AproveServiceExecuted (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = serviceSchemaParam.parse(request.params)

            const aproveServiceExecuted = await makeAproveServiceExecuted()
            
            await aproveServiceExecuted.execute({
                id
            })
            
            return reply.status(200).send({message: 'Service executed aproved'})
            
          } catch (error) {
            throw error
          }
}
    
