import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { RegisterUseCase } from "../register/register-usecase";
import { ResetPasswordUseCase } from "./reset-password-usecase";
import { Token, User } from "@prisma/client";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase;
let cardRepositoryInMemory: InMemoryCardRepository;
let stu: ResetPasswordUseCase;

describe("Reset password (unit)", () => {
    beforeEach(async () => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
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
            gender: 'MASCULINO',
            email: 'user-test@email.com',
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
            email: 'user1-test@email.com',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
            cpf: "951253879",
            gender: 'MASCULINO',
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

});