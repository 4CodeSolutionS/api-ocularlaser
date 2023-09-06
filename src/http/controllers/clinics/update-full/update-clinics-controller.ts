import { ClinicAlreadyExistsError } from '@/usecases/errors/clinic-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeCreateClinic } from '@/usecases/factories/clinics/make-create-clinic-usecase'
import { makeUpdateClinic } from '@/usecases/factories/clinics/make-update-clinic-usecas'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const clinicSchemaBody = z.object({
                id: z.string().uuid(),
                name: z.string().min(4).nonempty()
            })

            const { 
                id,
                name                
            } = clinicSchemaBody.parse(request.body)

            const updateClinicUseCase = await makeUpdateClinic()
            
            const {clinic} = await updateClinicUseCase.execute({
                id,
                name
            })
            
            return reply.status(200).send(clinic)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            if(error instanceof ClinicAlreadyExistsError){
                return reply.status(409).send({error: error.message})
            }
            throw error
          }
}
    
