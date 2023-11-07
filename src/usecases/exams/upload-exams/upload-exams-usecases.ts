import 'dotenv/config'
import { IExamsRepository } from "@/repositories/interface-exams-repository";
import { IServiceExecutedRepository } from "@/repositories/interface-services-executeds-repository";
import { IStorageProvider } from '@/providers/StorageProvider/storage-provider.interface';
import { AppError } from '@/usecases/errors/app-error';
import { env } from '@/env';

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
        private storageProvider: IStorageProvider
    ) {}

    async execute({
        idServiceExecuted,
        fileNameExame
    }:IRequestUploadExams):Promise<IResponseUploadExams>{
        // tamanho em numero do array de nomes de arquivos
        const lengthExams = fileNameExame.length as number
        // verificar se existe um nome para o arquivo
        if(lengthExams === 0){
            throw new AppError('Nenhum arquivo foi enviado', 400)
        }
        // buscar service executado pelo id
        const serviceExecuted = await this.serviceExecutedRepository.findById(idServiceExecuted);

        // verificar se existe um service executado com esse id
        if(!serviceExecuted){
            throw new AppError('Serviço executado não encontrado', 404)
        }

        if(serviceExecuted.approved){
            throw new AppError('Não é possível adicionar exames a um serviço aprovado', 400)
        }

        const pathFolder = `${env.FOLDER_TMP_DEVELOPMENT}/exams`
        // for para percorrer o array de nomes de arquivos
        for(let listFile of fileNameExame){
            // fazer upload do exame dentro firebase através do nome do arquivo
            let urlExam = await this.storageProvider.uploadFile(listFile.filename, pathFolder, 'exams' ) as string
            // criar no banco de dados as urls dos exames
            await this.examRepository.createExams({
                idServiceExecuted,
                urlExam
            })

        }

        // retornar lista de urls relacionadas ao service executado 
        const exams = await this.examRepository.listByServiceExecutedId(idServiceExecuted) as string[]

        // disparar email para o doctor com exames

        // console.log(exams)
        // retornar lista de urls de exames
        return {
            exams
        }

    }
}