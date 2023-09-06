import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeFindAddress } from '@/usecases/factories/address/make-find-addresses-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const addressSchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id
                
            } = addressSchema.parse(request.params)

            const findAddressUseCase = await makeFindAddress()
            
            const {address} = await findAddressUseCase.execute({
                id
            })
            
            return reply.status(200).send(address)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({message: error.message})
            }
            throw error
          }
}
    