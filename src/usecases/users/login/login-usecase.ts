import { env } from "@/env";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Role, User } from "@prisma/client";
import { compare } from "bcrypt";
import 'dotenv/config'
import jwt from 'jsonwebtoken'

interface IRequestLoginAccount {
    email: string,
    password: string,
}
export interface IResponseLoginAccount {
    accessToken: string
    refreshToken: string
    user: User
}

export class LoginUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider
    ) {}

    async execute({
        email,
        password
    }:IRequestLoginAccount):Promise<IResponseLoginAccount>{
        const findUserExists = await this.usersRepository.findByEmail(email)
        if(!findUserExists){
            throw new AppError('Credenciais inválidas', 401)
        }
        // comparar senha
        const passwordMatch = await compare(password, findUserExists.password)

        if(!passwordMatch){
            throw new AppError('Credenciais inválidas', 401)
        }
        // Criar access token
        const accessToken = jwt.sign({role: findUserExists.role as Role}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: findUserExists.id,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        }) 
       
        // Criar refresh token
        const refreshToken = jwt.sign({subject:findUserExists.id, email}, env.JWT_SECRET_REFRESH_TOKEN, {
            subject: findUserExists.id,
            expiresIn: env.JWT_EXPIRES_IN_REFRESH_TOKEN
        })

        // criar data de expiração do refresh token
        const expireDateRefreshToken = this.dayjsDateProvider.addDays(10)

        // Salvar refresh token no banco
        await this.usersTokensRepository.create({
            idUser: findUserExists.id,
            expireDate: expireDateRefreshToken,
            token: refreshToken,
        })
        
        const user = await this.usersRepository.getUserSecurity(findUserExists.id)
        
        if(!user){
            throw new AppError('Usuário não encontrado', 404)
        }

        return {
            user,
            accessToken,
            refreshToken,
        }
    }
}