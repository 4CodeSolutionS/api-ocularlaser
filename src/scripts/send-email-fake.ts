import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";

async function run() {
const ehtreal = await EtherealProvider.createTransporter();

    const pathTemplate = './src/views/emails/forgot-password.hbs'
    await ehtreal.sendEmail(
        'email@email.test', 
        'findUserByEmail.name', 
        'Redefinição de Senha', 
        'link', 
        pathTemplate 
    );

}
run();