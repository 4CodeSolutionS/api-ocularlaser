import { makeCreateClinic } from '@/usecases/factories/clinics/make-create-clinic-usecase'
import { Prisma } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateClinic (request: FastifyRequest, reply:FastifyReply){
        try {
            const clinicSchema = z.object({
                address: z.object({
                    street: z.string().nonempty(),
                    num: z.number().nonnegative(),
                    complement: z.string().nonempty(),
                    city: z.string().nonempty(),
                    state: z.string().nonempty(),
                    zip: z.string().nonempty(),
                    neighborhood: z.string().nonempty(),
                    reference: z.string().nonempty(),   
                }),
                name: z.string().min(4).nonempty()
            })

            const { 
                address:{
                    street,
                    num,
                    complement,
                    city,
                    state,
                    zip,
                    neighborhood,
                    reference
                },
                name
                
            } = clinicSchema.parse(request.body)

            const createClinicUseCase = await makeCreateClinic()
            
            const {clinic} = await createClinicUseCase.execute({
                address: {
                    id: '',
                    idClinic: null,
                    street,
                    num: new Prisma.Decimal(num),
                    complement,
                    city,
                    state,
                    zip,
                    neighborhood,
                    reference
                },
                name
            })
            
            return reply.status(201).send(clinic)
            
          } catch (error) {
            throw error
          }
}
    
