import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeDeleteCard } from '@/usecases/factories/cards/make-delete-cards-usecase'
import { makeDeleteService } from '@/usecases/factories/services/make-delete-services-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteCard (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                id: z.string().uuid()
            })

            const { 
                id,
            } = serviceSchemaParam.parse(request.params)

            const deleteCardUseCase = await makeDeleteCard()
            
             await deleteCardUseCase.execute({
                id
            })
            
            return reply.status(200).send({message: 'Cartão deletado com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
