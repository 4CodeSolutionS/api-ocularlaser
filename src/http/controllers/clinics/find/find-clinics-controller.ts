import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeFindClinic } from '@/usecases/factories/clinics/make-find-clinic-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const clinicSchemaParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id                
            } = clinicSchemaParams.parse(request.params)

            const findClinicUseCase = await makeFindClinic()
            
            const {clinic} = await findClinicUseCase.execute({
                id
            })
            
            return reply.status(200).send(clinic)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
