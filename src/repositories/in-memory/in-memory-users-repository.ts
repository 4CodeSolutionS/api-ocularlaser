import { Prisma, User, Role, $Enums, Card } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";
import { ICardRepository } from "../interface-cards-repository";

export class InMemoryUsersRepository implements IUsersRepository{
    public users: User[] = []
    
    constructor(
        private cardsRepository: ICardRepository,
    ){}

    async findByIdCostumerPayment(id: string){
        const user = this.users.find(user => user.idCostumerAsaas === id)

        if(!user){
            return null
        }

        return user;
    }

    async updateIdCostumerPayment(idUser: string, idCostumerPayment: string){
        const userIndex = this.users.findIndex(user => user.id === idUser)

        this.users[userIndex].idCostumerAsaas = idCostumerPayment as string

        return this.users[userIndex]
    }
    
    async turnAdmin(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].role = 'ADMIN' as Role

        return this.users[userIndex]
    }
    
   async getUserSecurity(id: string){
    const user = this.users.find(user => user.id === id)

    if(!user){
        return null
    }
    const userSecurity:User = {
        id: user.id,
        idCostumerAsaas: user.idCostumerAsaas,
        email: user.email,
        cpf: user.cpf,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        emailActive: user.emailActive,

        createdAt: user.createdAt,
    } as User
    return userSecurity;
    }

    async changePassword(id: string, password: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }
        
        this.users[userIndex].password = password as string
    }    

    async create({
        id,
        idClinic,
        idCostumerAsaas,
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
            idClinic: idClinic ? idClinic : null,
            idCostumerAsaas: idCostumerAsaas ? idCostumerAsaas : null,
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
        const card = await this.cardsRepository.findByIdUser(id)
        let arrayCards = card ? [card] : []

        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        return {
            ...user,
            cards: arrayCards
        }
    }

    async findByCPF(cpf: string){
        const user = this.users.find(user => user.cpf === cpf)

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
        phone,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].cpf = cpf as string
        this.users[userIndex].email = email as string
        this.users[userIndex].gender = gender as string
        this.users[userIndex].name = name as string
        this.users[userIndex].phone = phone as string

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}