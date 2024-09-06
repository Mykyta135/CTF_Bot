import { PrismaClient } from "@prisma/client";
import { bot } from "../../../bot";
import { HomeScene } from "../../../scenes/userScenes/homeScene";
import { Message } from "typescript-telegram-bot-api/dist/types";

const prisma = new PrismaClient();

export const startEvent = async (message: Message) => {
    await prisma.team.findMany({
        where: {
            isTestValid: true
        }
    }).then((teams) => {
        teams.forEach(async (team) => {
            prisma.team.update({
                where: { tid: team.tid },
                data: {
                    isEvent: true
                }
            }).then(() => {
                prisma.user.findMany({
                    where: {
                        teamCode: team.tid
                    }
                }).then((users) => {
                    users.forEach(async (user) => {
                        await bot.sendMessage({ chat_id: user.chat_id, text: "А перед початком змагань можете ознайомитися з інформацією:" })
                    })
                })
            })

        })

    })

}