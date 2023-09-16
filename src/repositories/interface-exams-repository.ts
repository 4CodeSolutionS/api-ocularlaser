import { Exam, Prisma } from "@prisma/client"

export interface IExamsRepository {
    createExams(data: Prisma.ExamUncheckedCreateInput):Promise<Exam>    
    listByServiceExecutedId(idServiceExecuted:string):Promise<Exam[] | string[]> 
}