import { makeUpdateAddress } from '@/usecases/factories/address/make-update-addresses-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const addressSchema = z.object({
                idClinic: z.string().uuid().nonempty(),
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
                idClinic,
                city,
                complement,
                num,
                state,
                street,
                zip,
                neighborhood,
                reference
                
            } = addressSchema.parse(request.body)

            const updateAddressUseCase = await makeUpdateAddress()
            
            const {address} = await updateAddressUseCase.execute({
                idClinic,
                city,
                complement,
                num,
                neighborhood,
                reference,
                state,
                street,
                zip
            })
            
            return reply.status(200).send(address)
            
          } catch (error) {
            throw error
          }
}
    
