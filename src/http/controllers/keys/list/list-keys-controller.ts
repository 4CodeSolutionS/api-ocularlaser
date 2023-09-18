import { makeListKey } from '@/usecases/factories/keys/make-list-keys-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListKey(request: FastifyRequest, reply:FastifyReply){
        try {
            const listKeyUseCase = await makeListKey()
            
            const {keys} = await listKeyUseCase.execute()
            
            return reply.status(200).send(keys)
            
          } catch (error) {
            throw error
          }
}
    
