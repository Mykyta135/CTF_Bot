import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot, UserSession } from "../../bot";
import { HomeScene } from "./homeScene";
import { z } from "zod";
import { TeamIdSchema } from "../../schemas/TeamSchema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const joinTeamScene = async (chatId: number, session: UserSession) => {
  await bot.sendMessage({ chat_id: chatId, text: "Введіть ID команди:" });

  bot.once("message", async (teamId: Message) => {
    if (teamId.text !== "/start" && teamId.chat.id === chatId) {
      await joinTeam(teamId.text!, chatId, session);
    }
  });
};

export const joinTeam = async (
  teamId: string,
  chatId: number,
  session: UserSession,
) => {
  try {
    const Id = TeamIdSchema.parse(teamId);
    const team = await prisma.team.findUnique({
      where: {
        tid: Id,
      },
    });
    if (!team) {
      await bot.sendMessage({ chat_id: chatId, text: "Команда не знайдена" });
    } else {
      const members = await prisma.user.findMany({
        where: {
          teamCode: Id,
        },
      });
      if (members.length <= 5) {
        await prisma.user
          .update({
            where: {
              chat_id: chatId,
            },
            data: {
              teamCode: Id,
            },
          })
          .then(async () => {
            await bot.sendMessage({
              chat_id: chatId,
              text: "Вітаю! Ви приєднались до команди",
            });
          });
      } else {
        await bot.sendMessage({
          chat_id: chatId,
          text: "Команда вже заповнена",
        });
      }
    }
    await HomeScene(chatId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation Error: ", error.errors);
      await bot.sendMessage({
        chat_id: chatId,
        text: `Помилка валідації: ${error.errors[0].message}`,
      });
      await joinTeamScene(chatId, session);
    } else {
      console.log("Database Error: ", error);
      await bot.sendMessage({
        chat_id: chatId,
        text: `Помилка бази даних. Спробуйте пізніше`,
      });
      await HomeScene(chatId);
    }
  }
};
