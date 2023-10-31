import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { RegisterUseCase } from "./register-usecase";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { InMemoryCardRepository } from "@/repositories/in-memory/in-memory-cards-repository";

let cardRepositoryInMemory: InMemoryCardRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let stu: RegisterUseCase;

describe("Register user (unit)", () => {
    beforeEach(() => {
        cardRepositoryInMemory = new InMemoryCardRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository(cardRepositoryInMemory)
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        stu = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
    });

    test("Should be able to register a new account", async () => {
        const { user } = await stu.execute({ 
            cpf: "132.456.789-10",
            email: 'kaio-dev@outlook.com',
            gender: 'MASCULINO',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
        });

        // confirmar se email foi enviado
        // const message = await sendMailProvider.findMessageSent(user.email)

        // expect(user.id).toEqual(expect.any(String))
        // expect(message).toEqual(
        //     expect.objectContaining({
        //         subject: 'Confirmação de email',
        //     })
        // )
    });

    test("Should not be able to register a new account with Email already exists", async () => {
        const email = 'email@test.com'

        await stu.execute({ 
            cpf: "123.456.789-10",
            email,
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        });

       await expect(()=> stu.execute({
            cpf: "132.456.789-10",
            email,
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        }),
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
    });

    test("Should not be able to register a new account with CPF already exists", async () => {
        const cpf = "134.456.789-10"

        await stu.execute({ 
            cpf,
            email: 'email1@test.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        });

       await expect(()=> stu.execute({
            cpf,
            email: 'email2@test.com',
            gender: 'MASCULINO',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        }),
        ).rejects.toBeInstanceOf(CPFAlreadyExistsError)
    });

});