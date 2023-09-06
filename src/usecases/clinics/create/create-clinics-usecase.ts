import { Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { ClinicAlreadyExistsError } from "@/usecases/errors/clinic-already-exists-error";

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
            throw new ClinicAlreadyExistsError()
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