import { Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestFindClinic {
    id:string
}

interface IResponseFindClinic {
    clinic:Clinic
}

export class FindClinicUseCase{
    constructor(
        private clinicsRepository: IClinicsRepository,
    ) {}

    async execute({
        id
    }:IRequestFindClinic):Promise<IResponseFindClinic>{
        // buscar clinica pelo id
        const findClinicExists = await this.clinicsRepository.findById(id)

        // validar se existe uma clinica
        if(!findClinicExists){
            throw new AppError('Clinica não encontrada', 404)
        }

        return {
            clinic: findClinicExists
        }
    }
}