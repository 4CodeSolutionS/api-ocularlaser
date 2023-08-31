import { Prisma, User, Role } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository{    
    public users: User[] = []
    
    async create({
        id,
        cpf,
        email,
        gender,
        name,
        password,
        phone,
        emailActive,
        role,
    }: Prisma.UserUncheckedCreateInput) {
        const user = {
            id: id ? id : randomUUID(),
            email,
            gender,
            name,
            password,
            phone,
            emailActive: emailActive ? emailActive : false,
            role: role ? role : 'PACIENT',
            cpf: cpf,
            createdAt: new Date()
            }
        
        this.users.push(user)

        return user;
    }

    async list() {
        return this.users
    }

    async findById(id: string){
        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        return user;
    }

    async findByEmail(email: string){
        const user = this.users.find(user => user.email === email)

        if(!user){
            return null
        }

        return user;
    }

    async findByCPF(cpf: string){
        const user = this.users.find(user => user.cpf === cpf)

        if(!user){
            return null
        }

        return user;
    }

    async activeEmail(id:string, activate = true) {
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].emailActive = activate
    }

    async update({ 
        id,
        cpf,
        email,
        gender,
        name,
        password,
        phone,
        role,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].cpf = cpf as string
        this.users[userIndex].email = email as string
        this.users[userIndex].gender = gender as string
        this.users[userIndex].name = name as string
        this.users[userIndex].password = password as string
        this.users[userIndex].phone = phone as string
        this.users[userIndex].role = role as Role

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}