import { PrismaClient } from "@prisma/client";
import { bot } from "../../../bot";
import { User } from "@prisma/client";

const prisma = new PrismaClient()

export const sendMessageAll = async () => {
    const users: User[] = await prisma.user.findMany();
    bot.once('message', async (msg) => {
        for (const user of users) {
            await bot.sendMessage({ chat_id: user.chat_id, text: msg.text! });
        }
      
    })

}