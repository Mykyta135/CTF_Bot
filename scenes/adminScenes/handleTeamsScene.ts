import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { PrismaClient } from "@prisma/client";
import { bot } from "../../bot";
import { deleteTeam } from "../../utils/database/adminScenes/deleteTeam";
import { aprooveTeam } from "../../utils/database/adminScenes/aprooveTeam";
import { declineTeam } from "../../utils/database/adminScenes/declineTeam";
import { adminScene } from "./adminScene";
import { logOfUser } from "../../utils/logOfUser";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { adminLayout } from "../../utils/keyboards/adminLayout";

const prisma = new PrismaClient()

export const handleTeamsScene = async (message: Message) => {

    logOfUser(message, "Entered Handle Teams Scene");
    try {
        await prisma.team.findMany(

        ).then(async (teams) => {
            teams.forEach(async (team) => {
                await createInlineKeyboard(message, `ім'я команди: ${team.name} \nЧи апрувнута команда: ${team.isTestValid ? "так" : "ні"}`, [
                    [{ text: 'Видалити', callback_data: `delete_team_${team.tid}` }],
                    [{ text: 'Тестове пройдено ✅', callback_data: `aproove_team_${team.tid}` }],
                    [{ text: 'Тестове не пройдено ❌', callback_data: `decline_team_${team.tid}` }],
                    [{ text: 'Назад', callback_data: `back` }],

                ])
            })
        })
    }
    catch (e) {
        console.log(e)
    }

    bot.on('callback_query', async (query) => {
        const teamId = query.data!.split('_')[2]

        if (query.data!.includes('delete_team')) {
            await deleteTeam(query, teamId, [[{ text: 'Назад', callback_data: `back` }], [{ text: "undo", callback_data: "undo" }]],)
        }
        if (query.data!.includes('aproove_team')) {
            await aprooveTeam(query, teamId)
        }
        if (query.data!.includes('decline_team')) {
            await declineTeam(query, teamId)
        }
        if (query.data === 'back') {
            await adminScene(query.message!)
        }
        await bot.answerCallbackQuery({ callback_query_id: query.id! });
    })





}