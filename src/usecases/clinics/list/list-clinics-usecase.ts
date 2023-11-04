import 'dotenv/config'
import { IClinicsRepository } from "@/repositories/interface-clinics-repository";
import { Clinic } from '@prisma/client';

interface IResponseListClinic {
    clinics: Clinic[]
}

export class ListClinicsUseCase{
    constructor(
        private clinicsRepository: IClinicsRepository,
    ) {}

    async execute():Promise<IResponseListClinic>{
        const clinics = await this.clinicsRepository.list()

        return {
            clinics
        }
    }
}