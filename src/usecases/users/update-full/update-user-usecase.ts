import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { User } from "@prisma/client";
import 'dotenv/config'

interface IRequestUpdateUser {
    id: string,
    cpf: string
    email: string,
    gender: string,
    name: string,
    phone: string,
}
interface IResponseUpdateUser {
    user: User
}

export class UpdateUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id,
        cpf,
        email,
        gender,
        name,
        phone,
    }:IRequestUpdateUser):Promise<IResponseUpdateUser>{
        const findUserExists = await this.usersRepository.getUserSecurity(id)

        if(!findUserExists){
            throw new AppError('Usuário não encontrado', 404)
        }

        const findCPFAlreadyExists = await this.usersRepository.findByCPF(cpf)

        if(findCPFAlreadyExists && findUserExists.cpf !== cpf){
            throw new AppError('CPF já cadastrado', 400)
        }

        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists && findUserExists.email !== email){
            throw new AppError('Email já cadastrado', 409)
        }


        const user = await this.usersRepository.update({
            id,
            cpf,
            email,
            gender,
            name,
            phone,
        })

        const userInfo = {
            id: user.id,
            cpf: user.cpf,
            email: user.email,
            gender: user.gender,
            name: user.name,
            phone: user.phone,
            role: user.role,
            emailActive: user.emailActive,
            createdAt: user.createdAt,
        } as User

        return {
            user: userInfo
        }
    }
}