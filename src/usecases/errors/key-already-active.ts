export class KeyAlreadyActive extends Error{
    constructor(){
        super('Key already active')
    }
}