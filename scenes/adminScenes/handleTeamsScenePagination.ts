import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { PrismaClient } from "@prisma/client";
import { bot } from "../../bot";
import { deleteTeam } from "../../utils/database/adminScenes/deleteTeam";
import { aprooveTeam } from "../../utils/database/adminScenes/aprooveTeam";
import { declineTeam } from "../../utils/database/adminScenes/declineTeam";
import { adminScene } from "./adminScene";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { undoDeleteTeam } from "../../utils/database/adminScenes/undoDeletedTeam";
import { logOfUser } from "../../utils/logOfUser";

const prisma = new PrismaClient()
const TEAMS_PER_PAGE = 1;

export const handleTeamsScenePagination = async (message: Message, query: CallbackQuery, page: number = 0) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');
    logOfUser(message, "Entered Handle Teams Pagination Scene");

    const skip = page * TEAMS_PER_PAGE;

    const teams = await prisma.team.findMany({
        skip: skip,
        take: TEAMS_PER_PAGE,
    });

    const totalTeams = await prisma.team.count();
    const totalPages = Math.ceil(totalTeams / TEAMS_PER_PAGE);

    teams.forEach((team) => {
        editInlineKeyboard(query, `ім'я команди: ${team.name} \nЧи апрувнута команда: ${team.isTestValid ? "так" : "ні"}`, [
            [{ text: 'Видалити', callback_data: `delete_team_${team.tid}` }],
            [{ text: 'Тестове пройдено ✅', callback_data: `aproove_team_${team.tid}` }],
            [{ text: 'Тестове не пройдено ❌', callback_data: `decline_team_${team.tid}` }],
            page > 0 ? [{ text: '⬅️ Попередня', callback_data: `previous_page_${page - 1}` }] : [],
            page < totalPages - 1 ? [{ text: '➡️ Наступна', callback_data: `next_page_${page + 1}` }] : [],
            [{ text: 'Назад', callback_data: `back` }],
        ]);
    });

    bot.on('callback_query', async (query) => {
        const teamId = query.data!.split('_')[2];

        if (query.data!.includes('delete_team')) {
            await deleteTeam(query, teamId, [
                page > 0 ? [{ text: '⬅️ Попередня', callback_data: `previous_page_${page - 1}` }] : [],
                page < totalPages - 1 ? [{ text: '➡️ Наступна', callback_data: `next_page_${page + 1}` }] : [],
                [{ text: 'Undo', callback_data: `undo` }],
                [{ text: 'Назад', callback_data: `back` }],
            ]);
        }

        if (query.data!.includes('aproove_team')) {
            await aprooveTeam(query, teamId);
        }
        if (query.data!.includes('decline_team')) {
            await declineTeam(query, teamId);
        }
        if (query.data === 'back') {
            await adminScene(message);
        }
        if (query.data!.includes('previous_page')) {
            const prevPage = parseInt(query.data!.split('_')[2]);
            await handleTeamsScenePagination(message, query, prevPage);
        }
        if (query.data!.includes('next_page')) {
            const nextPage = parseInt(query.data!.split('_')[2]);
            await handleTeamsScenePagination(message, query, nextPage);
        }
        await bot.answerCallbackQuery({ callback_query_id: query.id! });
    });


    await bot.answerCallbackQuery({ callback_query_id: query.id! });

};
