import 'dotenv/config'

interface IRequestReceiveEvent {
    event: string
    payment: {
        id: string
        status: string
    }
}

export class ReceiveEventOfPaymentsWebhook{
    constructor(
       
    ) {}

    async execute({
        event,
        payment
    }:IRequestReceiveEvent):Promise<any>{
        console.log(event)
        console.log(payment)
    }
}