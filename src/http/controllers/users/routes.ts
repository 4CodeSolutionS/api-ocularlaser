import { FastifyInstance } from 'fastify'
import { RegisterUser } from './register/register-user-controller'
export async function usersRoutes(fastifyApp: FastifyInstance) {
    // register user
    fastifyApp.post('/', RegisterUser)

    // login user
    // fastifyApp.post('/session', AuthenticateUserController)

    // --- Routes Authenticate --- //
    // get profile
    // fastifyApp.get('/me', {onRequest:[veridyJWT]}, GetProfileUserController)

    // refresh token
    // fastifyApp.patch('/token/refresh', RefreshToken)
}
