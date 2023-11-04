import { Address, Clinic } from "@prisma/client";
import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { AppError } from "@/usecases/errors/app-error";

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
            throw new AppError('Já existe uma clinica com esse nome', 409)
        }

        //criar a clinica
        const clinic = await this.clinicsRepository.create({
            address:{
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