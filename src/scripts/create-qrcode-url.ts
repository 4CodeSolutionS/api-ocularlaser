import * as fs from 'fs'
import 'dotenv/config'
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";


async function createPixQrcodeToStorage(){
   try {
   
      const file = fs.readFileSync('./src/assets/url-qrcode.json', 'utf-8')
   
      const urlQrcode = JSON.parse(file)

      if(urlQrcode.url){
            throw new Error()
      }

    const storage = new FirebaseStorageProvider()
    // fazer upload da imagem do qrcode no firebase
    // recuperar url do qrcode no firebase
    const qrcodeUrl = await storage.uploadFile('qrcode.png', './src/assets', 'qrcode')
    
   // escrever a URL dentro do arquivo txt 
   urlQrcode.url = String(qrcodeUrl);

   fs.writeFileSync('./src/assets/url-qrcode.json', JSON.stringify(urlQrcode))

    // salvar dentro de um arquivo txt e subir no firebase
    await storage.uploadFile('url-qrcode.json', './src/assets', 'qrcode')

    console.log('Qrcode URL created successfully!')
   } catch (error) {
    console.log('Error Qrcode URL already exists!')
   }
}
createPixQrcodeToStorage()