import { makeListClinic } from '@/usecases/factories/clinics/make-list-clinic-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const listClinicUseCase = await makeListClinic()
            
            const {clinics} = await listClinicUseCase.execute()
            
            return reply.status(200).send(clinics)
            
          } catch (error) {
            throw error
          }
}
    
