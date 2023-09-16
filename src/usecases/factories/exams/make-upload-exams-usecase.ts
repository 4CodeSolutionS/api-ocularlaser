import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider"
import { PrismaExamsRepository } from "@/repositories/prisma/prisma-exams-repository"
import { PrismaServicesExecutedsRepository } from "@/repositories/prisma/prisma-services-executeds-repository"
import { CreateExamsUseCase } from "@/usecases/exams/upload-exams/upload-exams-usecases"

export async function makeUploadExams(): Promise<CreateExamsUseCase> {
    const storageProvider = new FirebaseStorageProvider()
    const serviceExecuted = new PrismaServicesExecutedsRepository()
    const examsRepository = new PrismaExamsRepository()
    const createExamsUseCase = new CreateExamsUseCase(
        examsRepository,
        serviceExecuted,
        storageProvider
    )

    return createExamsUseCase
}