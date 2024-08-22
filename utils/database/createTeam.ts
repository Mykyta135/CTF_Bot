import { PrismaClient } from "@prisma/client";
import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
import { TeamNameSchema } from "../../validation/TeamSchema";
import { z } from "zod";
const prisma = new PrismaClient

export async function createTeam(data: string, chatId: number) {
    try {
        const validateTeam = TeamNameSchema.parse(data);
        const teamName = validateTeam;

        await prisma.team.create({
            data: {
                name: teamName
            }

        }).then(async (team) => {
            await prisma.user.update({
                where: {
                    chat_id: chatId
                },
                data: {
                    teamCode: team.tid
                }
            }).then(async () => {
                await bot.sendMessage({ chat_id: chatId, text: 'Команда створена. Щоб до неї доєдналися люди, поділіться ID команди: ' + team.tid });
            })
        })

    }
    catch (error) {
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