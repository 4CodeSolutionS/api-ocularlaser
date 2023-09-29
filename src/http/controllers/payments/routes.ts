import { FastifyInstance } from "fastify";
import { EventsWebHookPaymentsUseCases } from "./events-webhook/events-webhook-payments-controller";
import { CreatePayment } from "./create/create-payments-controller";

export async function paymentsRoutes(fastifyApp: FastifyInstance){
    // receive events payments
    fastifyApp.post('/events-webhook-payments', EventsWebHookPaymentsUseCases)   

    // create payments
    fastifyApp.post('/', CreatePayment)
}