import { makeCreatePayment } from '@/usecases/factories/payments/make-create-payments-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreatePayment (request: FastifyRequest, reply:FastifyReply){
        try {
            const paymentSchemaBody = z.object({
                serviceExecuted: z.object({
                    id: z.string().uuid().nonempty(),
                }),
                billingType: z.enum(['CREDIT_CARD', 'FETLOCK', 'PIX']),
                creditCard: z.object({
                    holderName: z.string().optional(),
                    number: z.string().optional(), 
                    expiryMonth: z.string().optional(),
                    expiryYear: z.string().optional(),
                    ccv: z.string().nonempty()
                }).optional(),
                creditCardHolderInfo: z.object({
                    name: z.string().nonempty(),
                    email: z.string().email().nonempty(),
                    cpfCnpj: z.string().nonempty(),
                    postalCode: z.string().nonempty(),
                    addressNumber: z.string().nonempty(),
                    addressComplement: z.string().nonempty(),
                    phone: z.string().nonempty()
                }).optional(),
                installmentCount: z.number().int().nonnegative().optional(),
                installmentValue: z.number().int().nonnegative().optional(),
            })
            const remoteIpSchema = z.string().nonempty()

            const { 
                billingType,
                creditCard,
                creditCardHolderInfo,
                installmentCount,
                installmentValue,
                serviceExecuted: { id: idServiceExecuted }
                }
            = paymentSchemaBody.parse(request.body)

            const remoteIpParsed = remoteIpSchema.parse(request.socket.remoteAddress)
            const createPaymentUseCase = await makeCreatePayment()
            
            const {payment} = await createPaymentUseCase.execute({
                creditCard,
                creditCardHolderInfo,
                installmentCount,
                installmentValue,
                remoteIp: remoteIpParsed,
                idServiceExecuted,
                billingType,
            })
            return reply.status(201).send(payment)
            
          } catch (error) {
            throw error
          }
}
    
