import { Prisma } from "@prisma/client";
import { IDiscountCouponsRepository } from "../interface-discount-coupons-repository";
import { prisma } from "@/lib/prisma";

export class PrismaDiscountCounpons implements IDiscountCouponsRepository{
    async findByClinic(idClinic: string){
        const discountCounpos = await prisma.discountCoupon.findMany({where: {idClinic}})

        return discountCounpos;
    }
    async findByCode(code: string){
        const discountCounpo = await prisma.discountCoupon.findUnique({where: {code}})

        return discountCounpo;
    }
    async create(data: Prisma.DiscountCouponUncheckedCreateInput){
        const discountCounpo = await prisma.discountCoupon.create({data})

        return discountCounpo;
    }
}