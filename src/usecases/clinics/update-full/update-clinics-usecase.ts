import { Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { ClinicAlreadyExistsError } from "@/usecases/errors/clinic-already-exists-error";

interface IRequestUpdateClinic {
    id: string
    name: string
}

interface IResponseUpdateClinic {
    clinic: Clinic
}

export class UpdateClinicUseCase{
    constructor(
        private clinicsRepository: IClinicsRepository,
    ) {}

    async execute({
        id,
        name
    }:IRequestUpdateClinic):Promise<IResponseUpdateClinic>{
        // buscar se existe uma clinica com o mesmo nome
        const findClinicExists = await this.clinicsRepository.findById(id)

        // validar se existe uma clinica com o mesmo nome
        if(!findClinicExists){
            throw new ResourceNotFoundError()
        }

        // buscar clinica pelo nome
        const findClinicByName = await this.clinicsRepository.findByName(name)

        // verificar se existe clincia com mesmo nome
        if(findClinicByName && findClinicExists.name !== name ){
            throw new ClinicAlreadyExistsError()
        }

        //criar a clinica
        const clinic = await this.clinicsRepository.updateById({
            id,
            name
        })

        //retornar a clinica
        return {
            clinic
        }
    }
}