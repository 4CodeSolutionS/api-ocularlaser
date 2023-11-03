import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { CreateDiscountCounpon } from "./create/create-discount-coupons-controller";

export async function discountCouponRoutes(fastifyApp: FastifyInstance) {
    // criate discount coupon
    fastifyApp.post('/', {
        onRequest:[
            verifyTokenJWT,
            verifyUserRole('ADMIN', 'SUPER')
        ]
    } , CreateDiscountCounpon)
}