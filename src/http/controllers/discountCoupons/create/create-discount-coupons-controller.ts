import { makeCreateDiscountCoupon } from '@/usecases/factories/discountCoupons/make-create-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateDiscountCounpon (request: FastifyRequest, reply:FastifyReply){
        try {
            const discountCouponSchemaBody = z.object({
              clinic: z.object({
                id: z.string().uuid().nonempty(),
              }),
              name: z.string().nonempty(),
              code: z.string().nonempty(),
              discount: z.number().positive(),
              startDate: z.string().nonempty(),
              expireDate: z.string().nonempty(),
              active: z.boolean(), 
            })

            const { 
             clinic: { id: idClinic },
             name,
             code,
             discount,
             expireDate,
             startDate,
             active
            } = discountCouponSchemaBody.parse(request.body)

            const createDiscountCouponUseCase = await makeCreateDiscountCoupon()
            
            const discountCoupon = await createDiscountCouponUseCase.execute({
                idClinic,
                name,
                code,
                discount,
                startDate: new Date(startDate), 
                expireDate: new Date(expireDate),
                active
            })
            
            return reply.status(201).send(discountCoupon)
            
          } catch (error) {
            throw error
          }
}
    
