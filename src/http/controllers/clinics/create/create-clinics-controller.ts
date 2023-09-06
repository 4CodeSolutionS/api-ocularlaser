import { ClinicAlreadyExistsError } from '@/usecases/errors/clinic-already-exists-error'
import { makeCreateClinic } from '@/usecases/factories/clinics/make-create-clinic-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const clinicSchema = z.object({
                address: z.object({
                    id: z.string().uuid()   
                }),
                name: z.string().min(4).nonempty()
            })

            const { 
                address,
                name
                
            } = clinicSchema.parse(request.body)

            const createClinicUseCase = await makeCreateClinic()
            
            const {clinic} = await createClinicUseCase.execute({
                idAddress: address.id,
                name
            })
            
            return reply.status(201).send(clinic)
            
          } catch (error) {
            if(error instanceof ClinicAlreadyExistsError){
                return reply.status(409).send({error: error.message})
            }
            throw error
          }
}
    
