import { InvalidCustomerError } from '@/usecases/errors/invalid-customer-error'
import { InvalidPaymentError } from '@/usecases/errors/invalid-payment-error'
import { PaymentAlreadyExistsError } from '@/usecases/errors/payment-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
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
                    holderName: z.string().nonempty(),
                    number: z.string().nonempty(), 
                    expiryMonth: z.string().nonempty(),
                    expiryYear: z.string().nonempty(),
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
            if(error instanceof PaymentAlreadyExistsError){
                return reply.status(409).send({ message: error.message })
            }
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({ message: error.message })
            }
            if(error instanceof InvalidCustomerError){
                return reply.status(400).send({ message: error.message })
            }
            if(error instanceof InvalidPaymentError){
                return reply.status(400).send({ message: error.message })
            }
            throw error
          }
}
    
