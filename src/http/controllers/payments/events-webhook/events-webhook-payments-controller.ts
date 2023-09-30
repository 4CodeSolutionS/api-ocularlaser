import { EventNotValidError } from '@/usecases/errors/event-not-valid-error'
import { PaymentAlreadyExistsError } from '@/usecases/errors/payment-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeReceiveEventsPaymentsWebHook } from '@/usecases/factories/payments/make-events-payments-webhook-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

export async function EventsWebHookPaymentsUseCases (request: FastifyRequest, reply:FastifyReply){
        try {
            const eventPaymentSchema = z.object({
                event: z.enum(['PAYMENT_RECEIVED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'],{invalid_type_error: 'Invalid event type'}),
                payment: z.object({
                    id: z.string().nonempty(),
                    customer: z.string().nonempty(),
                    installment: z.string().optional(),
                    value: z.number().nonnegative(),
                    netValue: z.number().nonnegative(),
                    description: z.string().optional(),
                    externalReference: z.string().nonempty(),
                    billingType: z.string().nonempty(),
                    paymentDate: z.string().nonempty(),
                    invoiceUrl: z.string().nonempty(),
                }),
            })
            const { 
                event,
                payment: {
                    id,
                    installment,
                    customer,
                    value,
                    netValue,
                    billingType,
                    invoiceUrl,
                    externalReference,
                    paymentDate,
                    description
                }
            } = eventPaymentSchema.parse(request.body)
            const EventsWebHookPaymentsUseCase = await makeReceiveEventsPaymentsWebHook()

            const payment = await EventsWebHookPaymentsUseCase.execute({
                event,
                payment: {
                    id,
                    installment,
                    customer,
                    value,
                    netValue,
                    invoiceUrl,
                    externalReference,
                    paymentDate,
                    billingType,
                    description
                }
            })
            
            return reply.status(200).send(payment)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(200).send({ message: error.message })
            }
            if(error instanceof EventNotValidError){
                return reply.status(200).send({ message: error.message })
            }
            if(error instanceof PaymentAlreadyExistsError){
                return reply.status(200).send({ message: error.message })
            }
            if(error instanceof ZodError){
                return reply.status(200).send({ message: error.message })
            }
            return reply.status(200).send({ message: error})
          }
}
    
