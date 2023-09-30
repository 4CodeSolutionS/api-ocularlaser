import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { ServiceAlreadyApprovedError } from '@/usecases/errors/service-already-approved-error'
import { makeUploadExams } from '@/usecases/factories/exams/make-upload-exams-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UploadExams (request: FastifyRequest, reply:FastifyReply){
        try {
            const uploadExameFiles = z.array(
              z.object({
                filename: z.string(),
              })
            )
            const safefileNames = uploadExameFiles.safeParse(request.files)

            if(!safefileNames.success){
              return reply.status(404).send({error: 'File not found'})
            }

            const fileNames = safefileNames.data

            const uploadExamsParams = z.object({
              id: z.string().uuid(),
            })

            const {id} = uploadExamsParams.parse(request.params)

            const uploadExamsUseCase = await makeUploadExams()
            
            const {exams} = await uploadExamsUseCase.execute({
              fileNameExame: fileNames,
              idServiceExecuted: id
            })

            return reply.status(201).send(exams)
            
          } catch (error) {
            if(error instanceof ServiceAlreadyApprovedError){
              return reply.status(401).send({error: error.message})
            }
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
