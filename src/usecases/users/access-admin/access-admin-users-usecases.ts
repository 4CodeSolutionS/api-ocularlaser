import { IUsersRepository } from "@/repositories/interface-users-repository";
import { User } from "@prisma/client";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { IKeysRepository } from "@/repositories/interface-keys-repository";
import { KeyAlreadyActive } from "@/usecases/errors/key-already-active";

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
            throw new ResourceNotFoundError()
        }

        // buscar key pelo id
        const findKeyExist = await this.keysRepository.findByKey(key)
        // validar se key existe
        if(!findKeyExist){
            throw new ResourceNotFoundError()
        }

        // validar se key esta ativa
        if(findKeyExist.active){
            throw new KeyAlreadyActive()
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