import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { addressRoutes } from "./http/controllers/address/route";
import { clinicsRoutes } from "./http/controllers/clinics/route";
import { servicesRoutes } from "./http/controllers/services/routes";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
  })

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


  
fastifyApp.setErrorHandler((error:FastifyError, _request:FastifyRequest, reply: FastifyReply)=>{
  if(error instanceof ZodError){
      return reply.status(400).send({message: 'Validation error', issues: error.format()})
  }

  if(env.NODE_ENV !== 'production'){
      console.log(error)
  }else{
      // Aqui adicionar monitoramento de log em produção
      // como Sentry/NewRelic/DataDog
  }

  return reply.status(500).send({message: error.message})
})
