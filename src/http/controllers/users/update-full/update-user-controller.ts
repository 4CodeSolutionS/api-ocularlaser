import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { PassportOrCPFRequiredError } from '@/usecases/errors/cpf-or-passport-required-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { makeUpdateUser } from '@/usecases/factories/users/make-update-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              id: z.string().uuid(),
              name: z.string().min(4), 
              email: z.string().email(), 
              phone: z.string(), 
              cpf: 
                z.string()
                .regex(new RegExp('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}'), "CPF invalid"),
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
    
