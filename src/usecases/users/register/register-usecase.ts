import { env } from "@/env";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { User } from "@prisma/client";
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from "crypto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestRegisterAccount {
    cpf: string
    email: string,
    gender: string,
    name: string,
    password: string,
    phone: string,
}
interface IResponseRegisterAccount {
    user: User
}

export class RegisterUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private dayjsDateProvider: IDateProvider,
        private usersTokensRepository: ITokensRepository,
        private sendMailProvider: IMailProvider
    ) {}

    async execute({
        cpf,
        email,
        gender,
        name,
        password,
        phone,
    }:IRequestRegisterAccount):Promise<IResponseRegisterAccount>{
        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists){
            throw new AppError('Email já cadastrado', 400)
        }

        const findCPFAlreadyExists = await this.usersRepository.findByCPF(cpf)

        if(findCPFAlreadyExists){
            throw new AppError('CPF já cadastrado', 400)
        }
       
        const criptingPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            cpf,
            email,
            gender,
            name,
            password: criptingPassword,
            phone,
        })

        
         // pegar template de verificaçao de email
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/verify-email.hbs':
        './build/views/emails/verify-email.hbs' 

        // gerar token valido por 3h
        const token = randomUUID()
        // gerar data em horas
        const expireDateHours = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
       await this.usersTokensRepository.create({
            idUser: user.id,
            expireDate: expireDateHours,
            token
        })
        // formatar link com token
        let link = env.NODE_ENV === "development" ?
        `${env.APP_URL_DEVLOPMENT}/users/verify-email?token=${token}`:
        `${env.APP_URL_PRODUCTION}/users/verify-email?token=${token}`

        // enviar verificação de email
        await this.sendMailProvider.sendEmail(
            email, 
            name,
            "Confirmação de email", 
            link, 
            pathTemplate,
            null
        )

        return {
            user
        }
    }
}