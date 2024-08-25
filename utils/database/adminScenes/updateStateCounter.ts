import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


 export async function updateStateCounter(chat_id: number, count: number) {
    await prisma.user.update({
        where: {
            chat_id: chat_id
        },
        data: {
            stateCount: count
        }
    })
    
}   
