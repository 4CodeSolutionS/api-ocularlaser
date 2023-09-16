import { Exam, Prisma } from "@prisma/client";
import { IExamsRepository } from "../interface-exams-repository";
import { randomUUID } from "crypto";

export class InMemoryExamsRepository implements IExamsRepository{
    private exams: Exam[] = []

    async createExams({
        id,
        idServiceExecuted,
        urlExam
    }: Prisma.ExamUncheckedCreateInput){
        const exam = {
            id: id ? id : randomUUID(),
            idServiceExecuted,
            urlExam
        }
        
        this.exams.push(exam)

        return exam
    }

    async listByServiceExecutedId(idServiceExecuted: string){
        //criar array para buscar exames pelo id do service executed e retornar apenas a url do exame
        const exams = this.exams.filter(exam => exam.idServiceExecuted === idServiceExecuted).map(exam => exam.urlExam) as string[]

        return exams
    }
}