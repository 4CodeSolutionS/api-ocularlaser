// fastify.d.ts

import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user:{
      role: 'ADMIN' | 'PACIENT' | 'DOCTOR'
      id: string;
    }
  }
}
