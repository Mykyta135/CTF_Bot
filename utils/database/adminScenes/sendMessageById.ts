import { PrismaClient } from "@prisma/client";
import { bot } from "../../../bot";

const prisma = new PrismaClient();

export const sendMessageByTeamId = async (teamId: string, text: string) => {
  await prisma.user
    .findMany({
      where: {
        teamCode: teamId,
      },
    })
    .then(async (users) => {
      for (const user of users) {
        await bot.sendMessage({ chat_id: user!.chat_id, text: text });
      }
    });
};
