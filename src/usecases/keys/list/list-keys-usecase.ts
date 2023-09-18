import { Key } from "@prisma/client";
import 'dotenv/config'
import { IKeysRepository } from "@/repositories/interface-keys-repository";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";


interface IResponseListKey {
    keys: Key[]
}

export class ListKeyUseCase{
    constructor(
        private keysRepository: IKeysRepository,
    ) {}

    async execute():Promise<IResponseListKey>{
        const keys = await this.keysRepository.list();
        
        //retornar a key
        return {
            keys
        }
    }
}