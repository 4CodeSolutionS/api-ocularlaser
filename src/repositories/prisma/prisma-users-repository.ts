import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements IUsersRepository{
    async findByCPF(cpf: string){
        const user = await prisma.user.findUnique({
            where: {cpf},
            select: {
                id: true,
                name: true,
                cpf: true,
                email: true,
                emailActive: true,
                phone: true,
                gender: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }
    
    async create(data: Prisma.UserUncheckedCreateInput){
        const user = await prisma.user.create(
            {
                data,
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    email: true,
                    emailActive: true,
                    phone: true,
                    gender: true,
                    role: true,
                    createdAt: true,
                }
            }) as unknown as User
        
        return user
    }

    async list(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                cpf: true,
                email: true,
                emailActive: true,
                phone: true,
                gender: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User[]

        return users
    }

    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                cpf: true,
                email: true,
                emailActive: true,
                phone: true,
                gender: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {email},
        }) 

        return user
    }

    async activeEmail(id: string): Promise<void | null> {
        await prisma.user.update({
            where: {
                id
            },
            data:{
                emailActive: true
            }
        })
    }

    async update(data: Prisma.UserUncheckedUpdateInput){
        const user = await prisma.user.update({
            where: {
                id: data.id as string
            },
            data
        })

        return user
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id
            }
        })
    }
}