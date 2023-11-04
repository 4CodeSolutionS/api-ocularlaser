import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { AppError } from '@/usecases/errors/app-error';

interface IRequestDeleteClinic {
    id:string
}

export class DeleteClinicUseCase{
    constructor(
        private clinicsRepository: IClinicsRepository,
    ) {}

    async execute({
        id
    }:IRequestDeleteClinic):Promise<void>{
        // buscar clinica pelo id
        const findClinicExists = await this.clinicsRepository.findById(id)

        // validar se existe uma clinica
        if(!findClinicExists){
            throw new AppError('Clinica não encontrada', 404)
        }

        //deletar uma clinica  
        await this.clinicsRepository.deleteById(id)

    }
}