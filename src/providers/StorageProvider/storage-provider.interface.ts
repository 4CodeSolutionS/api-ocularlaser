export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'qrcodes' | 'exams'): Promise<string | undefined>;
}
