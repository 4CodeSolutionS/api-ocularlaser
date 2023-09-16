import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
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
            const fileNames = uploadExameFiles.parse(request.files)

            const uploadExamsParams = z.object({
              id: z.string(),
            })

            const {id} = uploadExamsParams.parse(request.params)

            const uploadExamsUseCase = await makeUploadExams()
            
            const {exams} = await uploadExamsUseCase.execute({
              fileNameExame: fileNames,
              idServiceExecuted: id
            })

            return reply.status(201).send(exams)
            
          } catch (error) {
            if(error instanceof ResourceNotFoundError){
                return reply.status(404).send({error: error.message})
            }
            throw error
          }
}
    
