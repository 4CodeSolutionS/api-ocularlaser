import { makeCreateKey } from '@/usecases/factories/keys/make-create-keys-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function CreateKey(request: FastifyRequest, reply:FastifyReply){
        try {
            const createKeyUseCase = await makeCreateKey()
            
            const {key} = await createKeyUseCase.execute()
            
            return reply.status(201).send(key)
            
          } catch (error) {
            throw error
          }
}
    
