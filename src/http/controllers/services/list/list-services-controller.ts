import { makeListServices } from '@/usecases/factories/services/make-list-services-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListService (request: FastifyRequest, reply:FastifyReply){
        try {
            const listServiceUseCase = await makeListServices()
            
            const services = await listServiceUseCase.execute()
            
            return reply.status(200).send(services)
            
          } catch (error) {
            throw error
          }
}
    
