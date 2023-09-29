export class InvalidPaymentError extends Error{
    constructor(){
        super('Invalid payment!')
    }
}