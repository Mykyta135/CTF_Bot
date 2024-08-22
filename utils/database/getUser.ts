import { PrismaClient } from "@prisma/client";
import { Message } from "typescript-telegram-bot-api/dist/types";
const prisma = new PrismaClient();
export const getUserBlockInfo = async (message: Message): Promise<any> => {
    const user = await prisma.user.findUnique({
        where: {
            chat_id: message.chat.id,
        }
    });
    if (user)
        return user.isBlocked
}