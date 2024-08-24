import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { createInlineKeyboard } from "../../utils/keyboards/inlineKeyboards/createInlineKeyboard";
import { PrismaClient } from "@prisma/client";
import { bot } from "../../bot";
import { deleteTeam } from "../../utils/database/adminsDatabase/deleteTeam";
import { aprooveTeam } from "../../utils/database/adminsDatabase/aprooveTeam";
import { declineTeam } from "../../utils/database/adminsDatabase/declineTeam";
import { adminScene } from "./adminScene";
import { logOfUser } from "../../utils/logOfUser";

const prisma = new PrismaClient()

export const handleTeamsScene = async (message: Message, query: CallbackQuery, isUserBlocked: Map<number, boolean>) => {

    await logOfUser(message, "Entered Handle Teams Scene");
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
            await deleteTeam(query, teamId)
        }
        if (query.data!.includes('aproove_team')) {
            await aprooveTeam(query, teamId)
        }
        if (query.data!.includes('decline_team')) {
            await declineTeam(query, teamId)
        }
        if (query.data === 'back') {
            await adminScene(message, isUserBlocked)
        }
        await bot.answerCallbackQuery({ callback_query_id: query.id! });
    })





}