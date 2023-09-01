import { FastifyInstance } from 'fastify'
import { RegisterUser } from './register/register-user-controller'
import { LoginUser } from './login/login-user-controller'
import { VerifyEmail } from './verify-email/verify-email-controller'
import { LogoutUser } from './logout/logout-user-controller'
import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
import { SendForgotPassword } from './send-forgot-password/send-forgot-password'
import { ResetPassword } from './reset-password/reset-password-controller'
export async function usersRoutes(fastifyApp: FastifyInstance) {
    // register user
    fastifyApp.post('/', RegisterUser)

    // login user
    fastifyApp.post('/login', LoginUser)

    // logout user
    fastifyApp.post('/logout', {onRequest: [verifyTokenJWT]}, LogoutUser)

    // verify e-mail user
    fastifyApp.patch('/verify-email', VerifyEmail)

    // send forgot password user
    fastifyApp.post('/forgot-password', SendForgotPassword)

    // reset password user
    fastifyApp.patch('/reset-password', ResetPassword)
}
