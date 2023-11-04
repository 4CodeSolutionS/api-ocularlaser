import { DiscountCoupon, Prisma } from "@prisma/client";
import { IDiscountCouponsRepository } from "../interface-discount-coupons-repository";
import { randomUUID } from "crypto";

export class InMemoryDiscountCounponsRepository implements IDiscountCouponsRepository{
    private discountCoupons: DiscountCoupon[] = [];

    async findByClinic(idClinic: string){
        const discountCoupons = this.discountCoupons.filter(discountCoupon => discountCoupon.idClinic === idClinic);

        return discountCoupons;
    }
    
    async findByCode(code: string){
        const discountCoupon = this.discountCoupons.find(discountCoupon => discountCoupon.code === code);

        if(!discountCoupon){
            return null;
        }

        return discountCoupon;
    }

    async create({
        id,
        idClinic,
        name,
        code,
        discount,
        startDate,
        expireDate,
        active,
    }: Prisma.DiscountCouponUncheckedCreateInput){
        const discountCoupon = {
            id: id ? id : randomUUID(),
            idClinic,
            name,
            code,
            discount: new Prisma.Decimal(discount as number),
            startDate: startDate ? new Date(startDate) : new Date(),
            expireDate: new Date(expireDate),
            active: active ? active : false,
        }

        this.discountCoupons.push(discountCoupon);

        return discountCoupon;
        
    }
}