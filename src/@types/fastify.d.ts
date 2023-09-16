// fastify.d.ts
import { FastifyRequest } from 'fastify';
import File from '@/lib/interfaces'

declare module 'fastify' {
  interface FastifyRequest {
    files: File
    user:{
      role: 'ADMIN' | 'PACIENT' | 'DOCTOR'
      id: string;
    }
  }
}
