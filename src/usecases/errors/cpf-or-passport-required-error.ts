export class PassportOrCPFRequiredError extends Error{
    constructor(){
        super('CPF or Passport is required!')
    }
}