import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { RegisterUseCase } from "../register/register-usecase";
import { ResetPasswordUseCase } from "./reset-password-usecase";
import { Token, User } from "@prisma/client";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase;
let stu: ResetPasswordUseCase;

describe("Reset password (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        registerUseCase = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
        stu = new ResetPasswordUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory,
            dayjsDateProvider
        )

        await usersRepositoryInMemory.create({
            cpf: "12345678910",
            email: 'user-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })

        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useFakeTimers()
    })

    test("Should be able to reset passwod account", async () => {
        const {user} = await registerUseCase.execute({
            cpf: "123.456.789-10",
            email: 'user1-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
        const oldPassword = user.password
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id) as Token
        await stu.execute({ 
            token: userToken.token,
            password: '101010'
        });

        const updateUserPassword = await usersRepositoryInMemory.findByEmail(user.email) as User
        
        expect(updateUserPassword.password !== oldPassword).toBeTruthy()
    });

    test("Should not be able to verify a account with token expired", async () => {
        vi.setSystemTime( new Date(2023, 8, 23, 19, 0, 0))
        const {user} = await registerUseCase.execute({
            cpf: "1234567891110",
            email: 'user1-test@email.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id) as Token

        vi.setSystemTime( new Date(2023, 8, 23, 23, 0, 0))

        await expect(()=> stu.execute({ 
         token: userToken.token,
         password: '101010',
     }),
         ).rejects.toBeInstanceOf(AccessTimeOutError)
     });

});