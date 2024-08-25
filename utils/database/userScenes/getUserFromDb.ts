import { PrismaClient, User } from "@prisma/client";
import { Message } from "typescript-telegram-bot-api/dist/types";
const prisma = new PrismaClient();
export const getUserFromDb = async (message: Message) => {

        const user = await prisma.user.findUnique({
            where: {
                chat_id: message.chat.id,
            }
        });
        if (user)
            return(user);
        else
            return(undefined);
  
}