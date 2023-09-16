export interface IStorageProvider {
    uploadFile(fileName: string): Promise<string | undefined>;
}
