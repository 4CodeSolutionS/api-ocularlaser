export class PassportAlreadyExistsError extends Error{
    constructor(){
        super('Passport already exists!')
    }
}