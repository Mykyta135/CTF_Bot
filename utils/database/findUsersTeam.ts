import { PrismaClient } from "@prisma/client";
import { Message } from "typescript-telegram-bot-api/dist/types"


const prisma = new PrismaClient();

export const findUsersTeam = async (message: Message): Promise<string> => {
    return new Promise((resolve) => {
        prisma.user.findUnique({
            where: {
                chat_id: message.chat.id
            }
        }).then((user) => {
            if (user!.teamCode) {
                resolve(user!.teamCode)
            } else {
                resolve("")
            }
        }).catch((err) => {
            return "An error occured"
        })
    })
}
