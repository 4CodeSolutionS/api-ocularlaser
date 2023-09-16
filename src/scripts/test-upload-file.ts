import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";

async function run(){
    const storage = new FirebaseStorageProvider();

    await storage.uploadFile('logo-turistarv.png');
}
run();