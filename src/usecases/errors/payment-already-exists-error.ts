export class PaymentAlreadyExistsError extends Error{
    constructor(){
        super('Is not able payout payment same service excuted!')
    }
}