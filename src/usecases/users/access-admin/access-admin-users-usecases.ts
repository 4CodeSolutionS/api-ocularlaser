import { IUsersRepository } from "@/repositories/interface-users-repository";
import { User } from "@prisma/client";
import 'dotenv/config'
import { IKeysRepository } from "@/repositories/interface-keys-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestAccessAdmin {
   key: string
   idUser: string
}
interface IResponseAccessAdmin {
    user: User
}

export class AccessAdminUsersUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private keysRepository: IKeysRepository
    ) {}

    async execute({
        idUser,
        key
    }:IRequestAccessAdmin):Promise<IResponseAccessAdmin>{
        // encontrar usuario pelo id
        let findUserExist = await this.usersRepository.getUserSecurity(idUser)

        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('Usuário não encontrado', 404)
        }

        // buscar key pelo id
        const findKeyExist = await this.keysRepository.findByKey(key)
        // validar se key existe
        if(!findKeyExist){
            throw new AppError('Chave não encontrada', 404)
        }

        // validar se key esta ativa
        if(findKeyExist.active){
            throw new AppError('Chave já foi utilizada', 400)
        }

        // atualizar usuario
        const userAdmin = await this.usersRepository.turnAdmin(idUser) as User

        // atualizar key
        await this.keysRepository.activeKey(findKeyExist.id, idUser)

        // retornar usuario
        return {
            user: userAdmin
        }
    }
}