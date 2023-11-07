export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'qrcodes' | 'exams' | 'assets'): Promise<string | undefined>;
}
