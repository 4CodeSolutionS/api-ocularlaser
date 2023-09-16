import { Exam, Prisma } from "@prisma/client";
import { IExamsRepository } from "../interface-exams-repository";
import { prisma } from "@/lib/prisma";

export class PrismaExamsRepository implements IExamsRepository{
    async createExams(data: Prisma.ExamUncheckedCreateInput){
        const exam = await prisma.exam.create({
            data,
        })

        return exam
    }

    async listByServiceExecutedId(idServiceExecuted: string){
        const exams = await prisma.exam.findMany({
            where: {
                idServiceExecuted
            },
            select:{
                urlExam: true
            }
        }) as unknown as Exam[]
        
        return exams
    }
}