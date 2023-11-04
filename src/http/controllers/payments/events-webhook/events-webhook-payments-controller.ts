import { makeReceiveEventsPaymentsWebHook } from '@/usecases/factories/payments/make-events-payments-webhook-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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
                    originalValue: z.number().nullable().optional(),
                    description: z.string().optional(),
                    externalReference: z.string().nonempty(),
                    billingType: z.string().nonempty(),
                    paymentDate: z.string().nonempty(),
                    invoiceUrl: z.string().nonempty(),
                    creditCard: z.object({
                        creditCardToken: z.string()
                    }).optional()
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
                    originalValue,
                    billingType,
                    invoiceUrl,
                    externalReference,
                    paymentDate,
                    description,
                    creditCard
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
                    originalValue: originalValue ? originalValue : undefined,
                    invoiceUrl,
                    externalReference,
                    paymentDate,
                    billingType,
                    description,
                    creditCard,
                }
            })
            
            return reply.status(200).send(payment)
            
          } catch (error) {
            return reply.status(200).send({ message: error})
          }
}
    
