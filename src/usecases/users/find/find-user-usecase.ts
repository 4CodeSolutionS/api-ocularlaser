import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { User } from "@prisma/client";
import 'dotenv/config'

interface IRequestFindUser {
   id: string
}
interface IResponseFindUser {
    user: User
}

export class FindUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id
    }:IRequestFindUser):Promise<IResponseFindUser>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.getUserSecurity(id)

        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('Usuário não encontrado', 404)
        }

        // retornar usuario
        return {
            user: findUserExist
        }
    }
}