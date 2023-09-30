
export class ServiceAlreadyApprovedError extends Error{
    constructor(){
        super('Service already approved!')
    }
}