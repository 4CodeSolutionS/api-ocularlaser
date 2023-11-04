import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              cpf: 
                z.string()
                .refine((cpf) =>{
                  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
                  return cpfRegex.test(cpf)
                 
                }),
              name: z.string().min(4).nonempty(), 
              email: z.string().email().nonempty(), 
              password: z.string().min(6).nonempty(),
              phone: z.string().nonempty(), 
              gender: z.enum(['MASCULINO', 'FEMININO']), 
            })

            const { 
                email, 
                password,
                gender,
                name,
                phone,
                cpf,
            } = userSchema.parse(request.body)

            const registerUseCase = await makeRegisterUser()
            
            const {user} = await registerUseCase.execute({
                email, 
                password,
                gender,
                name,
                phone,
                cpf,
            })
            
            
            return reply.status(201).send(user)
            
          } catch (error) {
            throw error
          }
}
    
