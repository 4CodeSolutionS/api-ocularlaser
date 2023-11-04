import { makeFindCardByUser } from '@/usecases/factories/cards/make-find-by-user-cards-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindCardByUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const serviceSchemaParam = z.object({
                idUser: z.string().uuid()
            })

            const { 
                idUser,
            } = serviceSchemaParam.parse(request.params)

            const findCardByUserUseCase = await makeFindCardByUser()
            
            const card = await findCardByUserUseCase.execute({
                idUser
            })
            
            return reply.status(200).send(card)
          } catch (error) {
            throw error
          }
}
    
