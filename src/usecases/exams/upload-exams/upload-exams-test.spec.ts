import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryExamsRepository } from "@/repositories/in-memory/in-memory-exams-repository";
import { CreateExamsUseCase } from "./upload-exams-usecases";
import { InMemoryServiceExecutedRepository } from "@/repositories/in-memory/in-memory-services-executeds-respository";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryServicesRepository } from "@/repositories/in-memory/in-memory-services-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { CreateServiceExecutedUseCase } from "@/usecases/servicesExecuted/create/create-services-executeds-usecases";
import { hash } from "bcrypt";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let mailProviderInMemory: InMemoryMailProvider;
let clinicRepositoryInMemory: InMemoryClinicRepository;
let serviceRepositoryInMemory: InMemoryServicesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let examsRepositoryInMemory: InMemoryExamsRepository;
let serviceExecutedRepositoryInMemory: InMemoryServiceExecutedRepository;
let storageProviderInMemory: InMemoryStorageProvider;
let createServiceExecutedUseCase: CreateServiceExecutedUseCase;
let stu: CreateExamsUseCase;

describe("Create exams (unit)", () => {
    beforeEach(async () => {
        mailProviderInMemory = new InMemoryMailProvider()
        clinicRepositoryInMemory = new InMemoryClinicRepository()
        serviceRepositoryInMemory = new InMemoryServicesRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        examsRepositoryInMemory = new InMemoryExamsRepository();
        serviceExecutedRepositoryInMemory = new InMemoryServiceExecutedRepository(
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory
        )
        storageProviderInMemory = new InMemoryStorageProvider();
        createServiceExecutedUseCase = new CreateServiceExecutedUseCase(
            serviceExecutedRepositoryInMemory,
            mailProviderInMemory,
            usersRepositoryInMemory,
            serviceRepositoryInMemory,
            clinicRepositoryInMemory,
        )
        stu = new CreateExamsUseCase(
            examsRepositoryInMemory, 
            serviceExecutedRepositoryInMemory,
            storageProviderInMemory
        )

    });

    test("Should be able to create exams", async () => {
        // criar um service executed
        const clinic = await clinicRepositoryInMemory.create({
            id: "9c3dff89-03bc-4477-aa5d-67021af86354",
            name: "Clinic Test",
            address:{
                create:{
                    city: "City Test",
                    neighborhood: "Neighborhood Test",
                    num: 1,
                    state: "State Test",
                    street: "Street Test",
                    zip: "Zip Test",
                    complement: "Complement Test",
                    reference: "Reference Test"
                }
            }
       })

        const user = await usersRepositoryInMemory.create({
            id: "98ed1021-c869-4b76-838e-c9beb900792c",
            cpf: "123456789",
            email: "user1@test.com",
            name: "User Test",
            gender: "MASCULINO",
            phone: "123456789",
            password: await hash("123456", 8),
        })

        const service = await serviceRepositoryInMemory.create({
            id: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
            name: "Service Test",
            category: "EXAM",
            price: 500,
        })

        const serviceExecuted = await createServiceExecutedUseCase.execute({
            idUser: user.id,
            idClinic: clinic.id,
            idService: service.id,
            date: new Date(),
            dataPayment: new Date(),
        })

       const fileNames = [
        {
            filename: "icon-javascript.png",
        },
        {
            filename: "ocular.png",
        }
       ];

       const {exams} = await stu.execute({
            fileNameExame: fileNames,
            idServiceExecuted: serviceExecuted.id
       })

    expect(exams).toHaveLength(2);
    });

    test("Should not be able to create exams with invalid id service executed", async () => {
       const idServiceExecutedFake = "7b606dce-5419-4f79-8540-6ed63deea125";
       const fileNames = [
        {
            filename: "icon-javascript.png",
        },
        {
            filename: "ocular.png",
        }
       ];
       await expect(()=>  stu.execute({
        fileNameExame:fileNames,
        idServiceExecuted: idServiceExecutedFake
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should not be able to create exams with invalid invalid name", async () => {
        const clinic = await clinicRepositoryInMemory.create({
            id: "9c3dff89-03bc-4477-aa5d-67021af86354",
            name: "Clinic Test",
            address:{
                create:{
                    city: "City Test",
                    neighborhood: "Neighborhood Test",
                    num: 1,
                    state: "State Test",
                    street: "Street Test",
                    zip: "Zip Test",
                    complement: "Complement Test",
                    reference: "Reference Test"
                }
            }
       })

        const user = await usersRepositoryInMemory.create({
            id: "98ed1021-c869-4b76-838e-c9beb900792c",
            cpf: "123456789",
            email: "user1@test.com",
            name: "User Test",
            gender: "MASCULINO",
            phone: "123456789",
            password: await hash("123456", 8),
        })

        const service = await serviceRepositoryInMemory.create({
            id: "e1595d4f-a68e-49a5-aeae-02267fb4270c",
            name: "Service Test",
            category: "EXAM",
            price: 500,
        })

        const serviceExecuted = await createServiceExecutedUseCase.execute({
            idUser: user.id,
            idClinic: clinic.id,
            idService: service.id,
            date: new Date(),
            dataPayment: new Date(),
        })

        const fileNames: {filename:string}[] = [];
 
        await expect(()=>  stu.execute({
         fileNameExame: fileNames,
         idServiceExecuted: serviceExecuted.id
     })).rejects.toBeInstanceOf(ResourceNotFoundError)
     });
})