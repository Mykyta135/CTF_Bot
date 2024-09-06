import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
import { PrismaClient } from "@prisma/client";
import { logOfUser } from "../../utils/logOfUser";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { adminScene } from "./adminScene";
import { deleteTeam } from "../../utils/database/adminScenes/deleteTeam";
import { aprooveTeam } from "../../utils/database/adminScenes/aprooveTeam";
import { declineTeam } from "../../utils/database/adminScenes/declineTeam";

const prisma = new PrismaClient();
let currentTeamListener: (query: any) => void;

export const handleTeamsScene = async (chatId: number) => {
    

    // logOfUser(message, "Entered Handle Teams Scene");

    try {
        const teams = await prisma.team.findMany();

        for (const team of teams) {
            createInlineKeyboard(
                chatId,
                `ім'я команди: ${team.name} \nЧи апрувнута команда: ${team.isTestValid ? "так" : "ні"}`,
                [
                    [{ text: 'Видалити', callback_data: `delete-team_${team.tid}` }],
                    [{ text: 'Тестове пройдено ✅', callback_data: `aproove-team_${team.tid}` }],
                    [{ text: 'Тестове не пройдено ❌', callback_data: `decline-team_${team.tid}` }],
                    [{ text: 'Назад', callback_data: `back` }],
                ]
            );
        }
    } catch (e) {
        console.log(e);
    }

    if (currentTeamListener) {
        bot.removeListener('callback_query', currentTeamListener);
    }

    currentTeamListener = async (query) => {
        if (query.message?.chat.id === chatId) {
            const [action, teamId] = query.data!.split('_');

            if (action === 'delete-team') {
                await deleteTeam(query, teamId, [
                    [{ text: 'Назад', callback_data: `admin-back` }],

                ]);
            } else if (action === 'aproove-team') {
                await aprooveTeam(query, teamId);
            } else if (action === 'decline-team') {
                await declineTeam(query, teamId);
            } else if (query.data === 'admin-back') {
                await adminScene(query.message!);
            }

            await bot.answerCallbackQuery({ callback_query_id: query.id! });
        }
    };

    bot.once('callback_query', currentTeamListener);
};
