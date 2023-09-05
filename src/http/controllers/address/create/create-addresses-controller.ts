import { makeCreateAddress } from '@/usecases/factories/address/make-create-addresses-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const addressSchema = z.object({
                street: z.string().nonempty(),
                num: z.number().nonnegative(),
                complement: z.string().nonempty(),
                city: z.string().nonempty(),
                state: z.string().nonempty(),
                zip: z.string().nonempty(),
                neighborhood: z.string().nonempty(),
                reference: z.string().nonempty(),
            })

            const { 
                city,
                complement,
                num,
                state,
                street,
                zip,
                neighborhood,
                reference
                
            } = addressSchema.parse(request.body)

            const createAddressUseCase = await makeCreateAddress()
            
            const {address} = await createAddressUseCase.execute({
                city,
                complement,
                num,
                neighborhood,
                reference,
                state,
                street,
                zip
            })
            
            
            return reply.status(201).send(address)
            
          } catch (error) {
            throw error
          }
}
    
