import 'dotenv/config'
import { IDiscountCouponsRepository } from '@/repositories/interface-discount-coupons-repository';
import { DiscountCoupon } from '@prisma/client';
import { IClinicsRepository } from '@/repositories/interface-clinics-repository';
import { AppError } from '@/usecases/errors/app-error';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';

interface IRequestCreateDiscountCoupon {
    idClinic: string;
    name: string;
    code: string;
    discount: number;
    startDate: Date
    expireDate: Date;
    active: boolean;
}
export class CreateDiscountCounponUseCase{
    constructor(
        private discountCoupon: IDiscountCouponsRepository,
        private clinicsRepository: IClinicsRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        idClinic,
        name,
        code,
        discount,
        startDate,
        expireDate,
        active
    }:IRequestCreateDiscountCoupon):Promise<DiscountCoupon>{
        // buscar se o coupon ja existe pelo code
        const couponAlreadyExists = await this.discountCoupon.findByCode(code)

        // validar se o coupon ja existe
        if(couponAlreadyExists){
            throw new AppError('Já existe um cupom com esse código', 409)
        }

        // buscar clinica pelo id
        const clinic = await this.clinicsRepository.findById(idClinic)

        //verificar se a clinica existe
        if(!clinic){
            throw new AppError('Clinica não encontrada', 404)
        }
       
        // verificar se o coupons ja vai ser ativado
        if(active){
            startDate = new Date()
        }

        // verificar se a data de expiração é anterior que a data de inicio
        const compareDate = this.dayjsDateProvider.compareIfBefore(startDate, expireDate)

        // validar se a data de expiração é anterior que a data de inicio
        if(!compareDate){
            throw new AppError('A data de expiração não pode ser anterior que a data de inicio', 400)
        }
        
        //criar a discount coupon
        const discountCoupon = await this.discountCoupon.create({
            idClinic,
            name,
            code,
            discount,
            startDate,
            expireDate,
            active
        })

        //retornar a discount coupon
        return discountCoupon
    }
}