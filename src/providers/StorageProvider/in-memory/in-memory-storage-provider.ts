import { IStorageProvider } from "../storage-provider.interface";

export class InMemoryStorageProvider implements IStorageProvider {
    private storage: string[] = [];

    async uploadFile(fileName: string, pathFolder: string, folderStorage: string): Promise<string | undefined> {
        if(!fileName){
            return undefined;
        }
        
        this.storage.push(fileName);

        return fileName;
    }
   
}