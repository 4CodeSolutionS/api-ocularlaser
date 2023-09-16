import { IServiceExecuted } from "@/usecases/servicesExecuted/create/create-services-executeds-usecase";

export interface IEthrealProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string | null, 
        pathTemplate:string,
        serviceExecuted: IServiceExecuted | null
    ): Promise<void>
}