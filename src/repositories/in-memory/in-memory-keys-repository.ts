import { Key, Prisma } from "@prisma/client";
import { IKeysRepository } from "../interface-keys-repository";
import { randomUUID } from "crypto";

export class InMemoryKeysRepository implements IKeysRepository{
    private keys: Key[] = [];

    async findByKey(key: string){
        const findKey = this.keys.find(keyParam => keyParam.key === key);

        if(!findKey){
            return null;
        }

        return findKey;
    }

    async list(){
        return this.keys;
    }
    
    async create({
        id,
        idUser,
        key,
    }: Prisma.KeyUncheckedCreateInput){
        const createKey = {
            id: id ? id : randomUUID(),
            idUser: idUser ? idUser : null,
            key,
            active: false,
            createdAt: new Date()
        }

        this.keys.push(createKey);

        return createKey;
    }

    async activeKey(id: string, idUser: string){
        const keyIndex = this.keys.findIndex(key => key.id === id );

        this.keys[keyIndex].active = true;
        this.keys[keyIndex].idUser = idUser;

        return this.keys[keyIndex];
    }
}