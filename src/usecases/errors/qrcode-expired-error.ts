export class QrcodeExpiredError extends Error{
    constructor(){
        super('Qrcode expired!')
    }
}