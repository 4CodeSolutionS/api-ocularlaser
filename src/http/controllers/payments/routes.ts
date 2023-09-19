import { FastifyInstance } from "fastify";
import { ReceiveEventsPayments } from "./webhooks/receive-events-payments-controller";

export async function paymentsRoutes(fastifyApp: FastifyInstance){
    // receive events payments
    fastifyApp.post('/', ReceiveEventsPayments)   
}