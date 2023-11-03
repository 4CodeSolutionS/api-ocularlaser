import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs"
import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository"
import { PrismaDiscountCounpons } from "@/repositories/prisma/prisma-discount-counpons-repository"
import { CreateDiscountCounponUseCase } from "@/usecases/discountCoupons/create/create-discount-coupons-usecase"

export async function makeCreateDiscountCoupon(): Promise<CreateDiscountCounponUseCase> {
    const discountCounponRepository = new PrismaDiscountCounpons()
    const clinicRepository = new PrismaClinicsRepository()
    const dateProvider = new DayjsDateProvider()
    const createDiscountCounponUseCase = new CreateDiscountCounponUseCase(
        discountCounponRepository,
        clinicRepository,
        dateProvider
    )

    return createDiscountCounponUseCase
}