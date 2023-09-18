import { Key } from "@prisma/client";
import 'dotenv/config'
import { IKeysRepository } from "@/repositories/interface-keys-repository";
import { generatoRandomKey } from "@/utils/generator-random-key";


interface IResponseCreateKey {
    key: Key
}

export class CreateKeyUseCase{
    constructor(
        private keysRepository: IKeysRepository,
    ) {}

    async execute():Promise<IResponseCreateKey>{
        //criar a key.
        const key = await this.keysRepository.create({
           key: generatoRandomKey(150)
        })
        //retornar a key
        return {
            key
        }
    }
}