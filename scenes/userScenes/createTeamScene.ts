import { Message } from "typescript-telegram-bot-api/dist/types";

import { bot, UserSession } from "../../bot";
import { TeamNameSchema } from "../../schemas/TeamSchema";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { userState } from "../../schemas/UserSchema";
import { HomeScene } from "./homeScene";


const prisma = new PrismaClient();
export const createTeamScene = (chatId: number, session: UserSession) => {


    bot.sendMessage({ chat_id: chatId, text: 'Введіть назву команди:' });
    bot.once('message', async (teamName) => {
        if (teamName.text !== '/start' && teamName.message_id === chatId) {

            await createTeam(teamName.text, chatId, session);
        }

    });
}

async function createTeam(teamName: string, chatId: number, session: UserSession) {

   
    try {
        const validTeamName = TeamNameSchema.parse(teamName);

        const team = await prisma.team.create({
            data: {
                name: validTeamName
            }

        })
        if (team) {
            await prisma.user.update({
                where: {
                    chat_id: chatId
                },
                data: {
                    teamCode: team.tid,

                }
            })

            await bot.sendMessage({ chat_id: chatId, text: 'Команда створена. Щоб до неї доєдналися люди, поділіться ID команди: ' });
            await bot.sendMessage({ chat_id: chatId, parse_mode: 'HTML', text: `${team.tid}` });
            await HomeScene(chatId);
        }

    }
    catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Validation Error: ', error.errors);
            await bot.sendMessage({
                chat_id: chatId,
                text: `Помилка валідації: ${error.errors[0].message}`
            });
            createTeamScene(chatId, session);


        } else {
            console.log('Database Error: ', error);
            bot.sendMessage({
                chat_id: chatId,
                text: `Помилка бази даних. Спробуйте пізніше`
            });
            await HomeScene(chatId);

        }
    }


}