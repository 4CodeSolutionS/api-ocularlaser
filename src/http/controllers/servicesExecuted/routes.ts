import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FastifyInstance } from "fastify";
import { AproveServiceExecuted } from "./aprove/aprove-services-executeds-controller";
import { CreateServiceExecuted } from "./create/create-services-executeds-controller";
import { FindServiceExecuted } from "./find/find-services-executeds-controller";
import { ListServiceExecuted } from "./list/list-services-executeds-controller";
import { ListServiceExecutedByClinic } from "./list-by-clinic/list-by-clinic-services-executeds-controller";
import { ListServiceExecutedByUser } from "./list-by-user/list-by-user-services-executeds-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function servicesExecutedsRoutes(fastifyApp: FastifyInstance){
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // criar serviço
    fastifyApp.post('/', {
        onRequest: [
            verifyUserRole('ADMIN', 'PACIENT', 'SUPER'),
        ]
    }, CreateServiceExecuted)

    // encontrar serviço
    fastifyApp.get('/:id', {onRequest: [verifyUserRole('ADMIN', 'SUPER')]}, FindServiceExecuted)

    // listar serviços
    fastifyApp.get('/', {onRequest: [verifyUserRole('ADMIN', 'SUPER')]}, ListServiceExecuted)

    // listar serviços por clinica
    fastifyApp.get('/clinic', {onRequest: [verifyUserRole('ADMIN', 'SUPER')]}, ListServiceExecutedByClinic)

    // listar serviços por user
    fastifyApp.get('/user', {onRequest: [verifyUserRole('ADMIN', 'SUPER')]}, ListServiceExecutedByUser)

    // aprovar serviço
    fastifyApp.patch('/:id/approve',{onRequest: [verifyUserRole('ADMIN', 'SUPER')]}, AproveServiceExecuted)

}