import axios from "axios";
import { IAsaasProvider, IChargeData, ICustomerData } from "../interface-asaas-payment";
import "dotenv/config";

export class AsaasProvider implements IAsaasProvider {
    async findUniqueInstallments(idInstallment: string){
        try {
            const responseFindInstallments = await axios.get(`${process.env.ASAAS_API_URL}/installments/${idInstallment}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': `${process.env.ASAAS_API_KEY}`
                }
            }).then((response)=> {
                return response.data
            })
    
            return responseFindInstallments
        } catch (error) {
            console.log('Error find Unique Installments in ASAAS',error)

            return undefined
        }
    }
   
    async createPayment(data: IChargeData){
        try {
            const responseCreatePayment = await axios.post(`${process.env.ASAAS_API_URL}/payments`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': `${process.env.ASAAS_API_KEY}`
                }
            }).then((response)=> {
                return response.data
            })
            return responseCreatePayment
        } catch (error) {
           console.log(error)
        }
    }

    async createCustomer(data: ICustomerData){
        try {
            const responseCreateCustomer = await axios.post(`${process.env.ASAAS_API_URL}/customers`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': `${process.env.ASAAS_API_KEY}`
                }
            }).then((response)=> {
                return response.data
            })
            return responseCreateCustomer
        } catch (error) {
            console.log('Error create Customer in ASAAS')

            return undefined
        }
    }
}