import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import multer from "fastify-multer";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { addressRoutes } from "./http/controllers/address/route";
import { clinicsRoutes } from "./http/controllers/clinics/route";
import { servicesRoutes } from "./http/controllers/services/routes";
import { servicesExecutedsRoutes } from "./http/controllers/servicesExecuted/routes";
import { examsRoutes } from "./http/controllers/exams/routes";
import { keysRoutes } from "./http/controllers/keys/route";
import { paymentsRoutes } from "./http/controllers/payments/routes";
import { cardsRoutes } from "./http/controllers/cards/routes";
import { AppError } from "./usecases/errors/app-error";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    
})

fastifyApp.register(multer.contentParser)

fastifyApp.register(usersRoutes,{
    prefix: 'api/users'
})

fastifyApp.register(addressRoutes,{
    prefix: 'api/addresses'
})

fastifyApp.register(clinicsRoutes,{
    prefix: 'api/clinics'
})

fastifyApp.register(servicesRoutes,{
    prefix: 'api/services'
})

fastifyApp.register(servicesExecutedsRoutes,{
    prefix: 'api/services-executeds'
})

fastifyApp.register(examsRoutes,{
    prefix: 'api/exams'
})
fastifyApp.register(keysRoutes,{
    prefix: 'api/keys'
})

fastifyApp.register(paymentsRoutes,{
    prefix: 'api/payments'
})

fastifyApp.register(cardsRoutes,{
    prefix: 'api/cards'
})

fastifyApp.setErrorHandler((error:FastifyError, _request:FastifyRequest, reply: FastifyReply)=>{
  if(error instanceof ZodError){
      return reply.status(400).send({message: 'Erro de Validação', issues: error.format()})
  }

  if(error.message.includes('Multipart: Boundary not found')){
        return reply.status(400).send({message: 'O arquivo nao pode ser vazio'})
  }

  if(error instanceof AppError){
    return reply.status(error.statusCode).send({message: error.message})
  }

  if(env.NODE_ENV !== 'production'){
      console.log(error)
  }else{
      // Aqui adicionar monitoramento de log em produção
      // como Sentry/NewRelic/DataDog
  }

  return reply.status(500).send({message: error.message})
})
