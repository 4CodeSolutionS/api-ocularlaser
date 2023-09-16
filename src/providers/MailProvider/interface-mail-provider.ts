import { IServiceExecuted } from "@/usecases/servicesExecuted/create/create-services-executeds-usecases";
import { Message } from "./in-memory/in-memory-mail-provider";

export interface IMailProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string | null, 
        pathTemplate:string,
        serviceExecuted: IServiceExecuted | null
    ): Promise<void>

    findMessageSent(email: string): Promise<Message>
}