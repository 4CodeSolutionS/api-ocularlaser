import { Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";

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
            throw new ResourceNotFoundError()
        }

        //deletar uma clinica  
        await this.clinicsRepository.deleteById(id)

    }
}