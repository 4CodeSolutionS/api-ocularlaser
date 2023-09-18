import { Key, Prisma } from "@prisma/client";

export interface IKeysRepository {
    create(data: Prisma.KeyUncheckedCreateInput): Promise<Key>;
    findByKey(key: string): Promise<Key | null>;
    activeKey(id: string, idUser: string): Promise<Key>;
    list(): Promise<Key[]>;
}