import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeDeleteAddress } from '@/usecases/factories/address/make-delete-addresses-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const addressSchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id
                
            } = addressSchema.parse(request.params)

            const deleteAddressUseCase = await makeDeleteAddress()
            
            await deleteAddressUseCase.execute({
                id
            })
            
            
            return reply.status(200).send({message: "Address deleted successfully"})
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({message: error.message})
            }
            throw error
          }
}
    
