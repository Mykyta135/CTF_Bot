import { PrismaClient } from "@prisma/client";
import { bot } from "../../../bot";
import { User } from "@prisma/client";
import { Message } from "typescript-telegram-bot-api/dist/types";
import { isAdminChat } from "../../admins";

const prisma = new PrismaClient();

/**
 * Broadcasts the admin's next text message to every user. Only a message from
 * that admin's chat triggers it — before, the next message from any chat did.
 */
export const sendMessageAll = async (adminChatId: number) => {
  if (!isAdminChat(adminChatId)) return;
  const users: User[] = await prisma.user.findMany();
  const listener = async (msg: Message) => {
    if (msg.chat.id !== adminChatId || !msg.text) return;
    bot.off("message", listener);
    for (const user of users) {
      await bot.sendMessage({ chat_id: user.chat_id, text: msg.text });
    }
  };
  bot.on("message", listener);
};
