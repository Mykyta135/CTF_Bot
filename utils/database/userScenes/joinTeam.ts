import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../../bot";
import { PrismaClient } from "@prisma/client";
import { TeamIdSchema } from "../../../schemas/TeamSchema";
import { z } from "zod";
const prisma = new PrismaClient();


export const joinTeam = async (message: Message) => {

    const chatId = message.chat.id;
    try {
        const teamId = TeamIdSchema.parse(message.text);
        await prisma.team.findUnique({
            where: {
                tid: teamId
            }
        }).then(async (team) => {
            if (team) {
                await prisma.user.update({
                    where: {
                        chat_id: chatId
                    },
                    data: {
                        teamCode: teamId
                    }
                }).then(async () => {
                    await bot.sendMessage({ chat_id: chatId, text: 'Ви приєднались до команди' });
                })
            } else {
                await bot.sendMessage({ chat_id: chatId, text: 'Команди з таким ID не існує' });
            }
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Validation Error: ', error.errors);
            bot.sendMessage({
                chat_id: chatId,
                text: `Помилка валідації: ${error.errors[0].message}`
            });
        } else {
            console.log('Database Error: ', error);
            bot.sendMessage({
                chat_id: chatId,
                text: `Помилка бази даних. Спробуйте пізніше`
            });
        }
    }

}
