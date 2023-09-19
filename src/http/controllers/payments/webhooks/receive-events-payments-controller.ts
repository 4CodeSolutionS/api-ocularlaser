import { makeReceiveEventsPaymentsWebHook } from '@/usecases/factories/payments/make-verify-events-payments-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ReceiveEventsPayments(request: FastifyRequest, reply:FastifyReply){
        try {
            const addressSchema = z.object({
                event: z.string().nonempty(),
                payment: z.object({
                    id: z.string().nonempty(),
                    status: z.string().nonempty(),
                })
            })

            const { 
                event,
                payment
                
            } = addressSchema.parse(request.body)

            const receiveEventsPayments = await makeReceiveEventsPaymentsWebHook()
            
            await receiveEventsPayments.execute({
                event,
                payment
            })
            
            return reply.status(200).send()
            
          } catch (error) {
            throw error
          }
}
    
