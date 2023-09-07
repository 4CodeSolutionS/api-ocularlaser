import { Address, Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { ClinicAlreadyExistsError } from "@/usecases/errors/clinic-already-exists-error";

interface IRequestCreateClinic {
    address: Address
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
        address:{
            city,
            complement,
            neighborhood,
            num,
            reference,
            state,
            street,
            zip
        },
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
            Address:{
                create:{
                    city,
                    complement,
                    neighborhood,
                    num,
                    reference,
                    state,
                    street,
                    zip
                },
            },
            name
        })

        //retornar a clinica
        return {
            clinic
        }
    }
}