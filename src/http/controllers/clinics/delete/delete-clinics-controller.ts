import { makeDeleteClinic } from '@/usecases/factories/clinics/make-delete-clinic-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const clinicSchemaParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id                
            } = clinicSchemaParams.parse(request.params)

            const deleteClinicUseCase = await makeDeleteClinic()
            
             await deleteClinicUseCase.execute({
                id
            })
            
            return reply.status(200).send({message: 'Clinic deleted successfully'})
            
          } catch (error) {
            throw error
          }
}
    
