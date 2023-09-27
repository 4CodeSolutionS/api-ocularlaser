import { Prisma, User } from "@prisma/client"

export interface IUsersRepository {
    create(data:Prisma.UserUncheckedCreateInput): Promise<User>
    list(): Promise<User[]>
    findById(id:string): Promise<User | null>
    findByIdCostumerPayment(id:string): Promise<User | null>
    getUserSecurity(id:string): Promise<User | null>
    findByEmail(email:string): Promise<User | null>
    findByCPF(cpf:string): Promise<User | null>

    activeEmail(id:string, activate?: boolean): Promise<void | null>
    changePassword(id:string, password:string): Promise<void | null>
    update(data:Prisma.UserUncheckedUpdateInput): Promise<User>
    updateIdCostumerPayment(idUser:string, idCostumerPayment:string): Promise<User> 
    turnAdmin(id:string): Promise<User | null>
    delete(id:string): Promise<void>
}