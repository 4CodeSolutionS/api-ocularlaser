import { verifyUserRole } from "@/http/middlewares/veiryf-user-role"
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { UploadExams } from "./upload-exams/upload-exams-controller"
import { FastifyInstance } from "fastify"
import { tmpDirectoriesUploadConfig } from "@/config/upload-files"
import multer from "fastify-multer";

 const {exams} = tmpDirectoriesUploadConfig

const uploadExams = multer(exams)

export async function examsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    
    // create exams
    fastifyApp.post('/:id', {
        onRequest: [
            uploadExams.array('exams', 12),
            verifyUserRole('ADMIN', 'PACIENT'), 
        ],
    }, UploadExams) 
}
