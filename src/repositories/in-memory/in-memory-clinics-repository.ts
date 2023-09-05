import { Clinic, Prisma } from "@prisma/client";
import { IClinicsRepository } from "../interface-clinics-repository";
import { randomUUID } from "crypto";

export class InMemoryClinicRepository implements IClinicsRepository{
    private clinics: Clinic[] = []

    async create({
        id,
        idAddress,
        name,
    }: Prisma.ClinicUncheckedCreateInput){
        const clinic = {
            id: id ? id : randomUUID(),
            idAddress,
            name,
        }

        this.clinics.push(clinic)

        return clinic
    }

    async list(){
        return this.clinics
    }

    async findById(id: string){
        const clinic = this.clinics.find(clinic => clinic.id === id)

        if(!clinic){
            return null
        }

        return clinic
    }

    async findByName(name: string){
        const clinic = this.clinics.find(clinic => clinic.name === name)

        if(!clinic){
            return null
        }

        return clinic
    }

    async updateById({
        id,
        name,
    }: Prisma.ClinicUncheckedUpdateInput){
        const clinicIndex = this.clinics.findIndex(clinic => clinic.id === id)

        this.clinics[clinicIndex].name = name as string

        return this.clinics[clinicIndex]
    }

    async deleteById(id: string){
        const clinicIndex = this.clinics.findIndex(clinic => clinic.id === id)

        this.clinics.splice(clinicIndex, 1)
    }

}