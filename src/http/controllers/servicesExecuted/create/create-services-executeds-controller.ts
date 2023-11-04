import { makeCreateServiceExecuted } from '@/usecases/factories/servicesExecuted/make-create-services-executeds-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateServiceExecuted (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                user: z.object({
                    id: z.string().uuid(),
                }),
                clinic: z.object({
                    id: z.string().uuid(),
                }),
                service: z.object({
                    id: z.string().uuid(),
                }),
            })

            const { 
                clinic,
                user,
                service,
            } = serviceSchemaParam.parse(request.body)

            const createServiceExecuted = await makeCreateServiceExecuted()

            const serviceExecuted = await createServiceExecuted.execute({
                idClinic: clinic.id,
                idService: service.id,
                idUser: user.id,
            })
            
            return reply.status(201).send(serviceExecuted)
            
          } catch (error) {
            throw error
          }
}
    
