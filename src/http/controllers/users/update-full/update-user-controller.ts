import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { PassportOrCPFRequiredError } from '@/usecases/errors/cpf-or-passport-required-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeUpdateUser } from '@/usecases/factories/users/make-update-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              id: z.string().uuid().nonempty(),
              name: z.string().min(4).nonempty(), 
              email: z.string().email().nonempty(), 
              phone: z.string().nonempty(), 
              cpf: 
                z.string()
                .refine((cpf) =>{
                  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
                  return cpfRegex.test(cpf)
                 
                }),
              gender: z.enum(['MASCULINO', 'FEMININO']), 
            })

            const { 
                id,
                email, 
                gender,
                name,
                phone,
                cpf,
            } = userSchemaBody.parse(request.body)

            const updateUserUseCase = await makeUpdateUser()
            
            const {user} = await updateUserUseCase.execute({
                id,
                email, 
                gender,
                name,
                phone,
                cpf,
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
                return reply.status(404).send({ message: error.message})
              }
            if(error instanceof  EmailAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  CPFAlreadyExistsError){
                return reply.status(401).send({ message: error.message})
            }
            throw error
          }
}
    
