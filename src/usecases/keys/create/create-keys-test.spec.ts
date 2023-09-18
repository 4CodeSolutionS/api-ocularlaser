import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryClinicRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { InMemoryKeysRepository } from "@/repositories/in-memory/in-memory-keys-repository";
import { CreateKeyUseCase } from "./create-keys-usecases";

let keysInMemoryRepository: InMemoryKeysRepository;
let stu: CreateKeyUseCase;

describe("Create keys (unit)", () => {
    beforeEach(async () => {
        keysInMemoryRepository = new InMemoryKeysRepository()
        stu = new CreateKeyUseCase(
            keysInMemoryRepository, 
        )

    });

    test("Should be able to create a key", async () => {
       const {key} = await stu.execute()
       expect(key).toEqual(
        expect.objectContaining({
            id: expect.any(String),
        })
       )
    });
})