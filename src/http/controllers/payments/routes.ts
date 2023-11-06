import { FastifyInstance } from "fastify";
import { EventsWebHookPaymentsUseCases } from "./events-webhook/events-webhook-payments-controller";
import { CreatePayment } from "./create/create-payments-controller";
import { verifyAsaasToken } from "@/http/middlewares/verify-token-asaas";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";

export async function paymentsRoutes(fastifyApp: FastifyInstance){
    // receive events payments
    fastifyApp.post('/events-webhook-payments', {
        onRequest:[verifyAsaasToken]
    }, EventsWebHookPaymentsUseCases)   

    // create payments
    fastifyApp.post('/', {
        onRequest:[verifyTokenJWT]
    }, CreatePayment)
}