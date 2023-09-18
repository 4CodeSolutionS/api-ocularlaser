import { Prisma } from "@prisma/client";
import { IKeysRepository } from "../interface-keys-repository";
import { prisma } from "@/lib/prisma";

export class PrismaKeysRepository implements IKeysRepository{
    async findByKey(key: string){
        const findKey = await prisma.key.findUnique({
            where: {key}
        })
        return findKey;
    }
    
    async list(){
        return await prisma.key.findMany();
    }
    
    async create(data: Prisma.KeyUncheckedCreateInput){
        const key = await prisma.key.create({data})
        return key;
    }
    
    async activeKey(id: string, idUser: string){
        const key = await prisma.key.update({
            where: {id},
            data: {active: true, idUser}
        })
        return key;
    }
}