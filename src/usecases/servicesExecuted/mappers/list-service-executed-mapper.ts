import { Clinic, Payment, Service, ServiceExecuted, User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface IServiceExecutedInnerJoin{
    id: string;
    user: User;
    service: Service;
    clinic: Clinic;
    price: Decimal;
    dataPayment: Date;
    date: Date;
    approved: boolean;
}

export interface IServiceExecutedFormmated{
    id: string;
    user: User;
    service: Service;
    clinic: Clinic;
    payment: Payment;
    price: number;
    approved: boolean;
}

export async function ListServiceExecutedMapper(servicesExecuteds: ServiceExecuted[]): Promise<IServiceExecutedFormmated[]> {
    const serviceExecutedFormatted = servicesExecuteds.map((serviceExecuted) => {
         const newServiceExecuted = { ...serviceExecuted } as unknown as IServiceExecutedFormmated
 
         newServiceExecuted.price = Number(newServiceExecuted.price)
 
         return newServiceExecuted
     })

     return serviceExecutedFormatted
 }