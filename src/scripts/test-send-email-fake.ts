import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";
import { IServiceExecuted } from "@/usecases/servicesExecuted/create/create-services-executeds-usecases";

async function run() {
const ehtreal = await EtherealProvider.createTransporter();

const variablesServiceExecuted:IServiceExecuted = {
    name: 'Kaio',
    email: 'kaio@test.com',
    service: 'Consulta Médica',
    clinic: 'Clinic Test',
    date: new Date('2021-09-01'),
    dataPayment: new Date('2021-09-01'),
    price: 500,
    exams:[
        'http://exame1.ocularlaser.com', 
        'http://exame2.ocularlaser.com'
    ],
    serviceMessage: 'que a Consulta Médica',
}

const listToSendEmail = [
    {
        name: 'admin',
        email: 'admin@test.com',
        subject: 'Nova Cirurgia Médica',
        pathTemplate: './views/emails/admin.hbs'
    },
    // {
    //     name: 'doctor',
    //     email: 'doctor@test.com',
    //     subject: sujectService,
    //     pathTemplate: ''
    // },
    {
        name: 'Kaio',
        email: 'kaio@test.com',
        subject: 'Recibo de Pagamento',
        pathTemplate: './views/emails/pacient.hbs'
    }
]

    for(let to of listToSendEmail){
    await ehtreal.sendEmail(
        to.email, 
        to.name, 
        to.subject, 
        '', 
        to.pathTemplate, 
        variablesServiceExecuted)
    // await this.mailProvider.sendEmail()
}

}
run();