import { makeDeleteCard } from '@/usecases/factories/cards/make-delete-cards-usecase'
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
    
