import { Clinic } from "@prisma/client";
import 'dotenv/config'
import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestCreateClinic {
    idAddress: string
    name: string
}

interface IResponseCreateClinic {
    clinic: Clinic
}

export class CreateClinicUseCase{
    constructor(
        private clinicsRepository: IClinicsRepository,
    ) {}

    async execute({
        idAddress,
        name
    }:IRequestCreateClinic):Promise<IResponseCreateClinic>{
        // buscar se existe uma clinica com o mesmo nome
        const clinicAlreadyExists = await this.clinicsRepository.findByName(name)

        // validar se existe uma clinica com o mesmo nome
        if(clinicAlreadyExists){
            throw new ResourceNotFoundError()
        }

        //criar a clinica
        const clinic = await this.clinicsRepository.create({
            idAddress,
            name
        })

        //retornar a clinica
        return {
            clinic
        }
    }
}