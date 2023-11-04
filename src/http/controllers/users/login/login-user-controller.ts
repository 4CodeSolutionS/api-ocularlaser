import { makeLoginUser } from '@/usecases/factories/users/make-login-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function LoginUser (request: FastifyRequest, reply:FastifyReply){
    try {
        const userSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6).nonempty(),
        })

        const {
            email,
            password,
        } = userSchema.parse(request.body)
        
        const loginUserUseCase = await makeLoginUser()

        const userInfo = await loginUserUseCase.execute({
          email,
          password,
        })
        return reply.status(200).send(userInfo)

      } catch (error) {
        throw error
      }
}

