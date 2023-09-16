import 'dotenv/config'
import { IExamsRepository } from "@/repositories/interface-exams-repository";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";

interface IRequestUploadExams {
    idServiceExecuted: string
    fileNameExame: {
        filename: string
    }[]
}

interface IResponseUploadExams {
    exams: string[]
}

export class CreateExamsUseCase{
    constructor(
        private examRepository: IExamsRepository,
        private serviceExecutedRepository: IServiceExecutedRepository,
        private storageProvider: FirebaseStorageProvider
    ) {}

    async execute({
        idServiceExecuted,
        fileNameExame
    }:IRequestUploadExams):Promise<IResponseUploadExams>{
        // tamanho em numero do array de nomes de arquivos
        const lengthExams = fileNameExame.length as number
        // verificar se existe um nome para o arquivo
        if(lengthExams === 0){
            throw new ResourceNotFoundError()
        }
        // buscar service executado pelo id
        const serviceExecuted = await this.serviceExecutedRepository.findById(idServiceExecuted);

        // verificar se existe um service executado com esse id
        if(!serviceExecuted){
            throw new ResourceNotFoundError()
        }

        // for para percorrer o array de nomes de arquivos
        for(let listFile of fileNameExame){
            // fazer upload do exame dentro firebase através do nome do arquivo
            let urlExam = await this.storageProvider.uploadFile(listFile.filename) as string
            // criar no banco de dados as urls dos exames
            await this.examRepository.createExams({
                idServiceExecuted,
                urlExam
            })
        }

        // retornar lista de urls relacionadas ao service executado 
        const exams = await this.examRepository.listByServiceExecutedId(idServiceExecuted) as string[]

        // console.log(exams)
        // retornar lista de urls de exames
        return {
            exams
        }

    }
}