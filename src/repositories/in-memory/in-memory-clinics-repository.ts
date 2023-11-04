import { Clinic, Prisma } from "@prisma/client";
import { IClinicsRepository } from "../interface-clinics-repository";
import { randomUUID } from "crypto";
import { InMemoryDiscountCounponsRepository } from "./in-memory-discount-coupons-repository";

export class InMemoryClinicRepository implements IClinicsRepository{
    private clinics: Clinic[] = []

    constructor(
        private discountCouponsRepository: InMemoryDiscountCounponsRepository
    ){}

    async create({
        id,
        address,
        name,
    }: Prisma.ClinicUncheckedCreateInput){
        const clinic = {
            id: id ? id : randomUUID(),
            name,
            address,
            discountCoupons: []
        }

        this.clinics.push(clinic)

        return clinic
    }

    async list(){
        return this.clinics
    }

    async findById(id: string){
        const discountCoupon = await this.discountCouponsRepository.findByClinic(id)
        
        const clinic = this.clinics.find(clinic => clinic.id === id)

        if(!clinic){
            return null
        }

        return {
            ...clinic,
            discountCoupons: discountCoupon
        }
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