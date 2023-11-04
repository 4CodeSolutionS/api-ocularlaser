import { DiscountCoupon, Prisma } from "@prisma/client"

export interface IDiscountCouponsRepository {
    create(data: Prisma.DiscountCouponUncheckedCreateInput):Promise<DiscountCoupon>
    findByCode(code:string):Promise<DiscountCoupon | null>
    findByClinic(idClinic:string):Promise<DiscountCoupon[]>
}