import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";

import { teamInfo } from "../../utils/database/userScenes/teamInfo";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { teamAboutLayout } from "../../utils/keyboards/teamAboutLayout";
import { PrismaClient } from "@prisma/client";
import { handleKeyboardLayout, HomeScene } from "./homeScene";

import { startMessage } from "./homeScene";
import { deleteTeam } from "../../utils/database/adminScenes/deleteTeam";
import { sendMessageByTeamId } from "../../utils/database/adminScenes/sendMessageById";
import { sendMessageToUser } from "../adminScenes/handleUsersScene";
const prisma = new PrismaClient();

export const teamAboutScene = async (chatId: number, query: CallbackQuery, teamId: any) => {
    const teamAboutString = await teamInfo(teamId);
    editInlineKeyboard(query, teamAboutString, teamAboutLayout);

    bot.once('callback_query', async (query) => {
        if (query.message?.chat.id === chatId) {
            if (query.data === 'back') {
                editInlineKeyboard(query, startMessage, await handleKeyboardLayout(chatId));
            }
            if (query.data === 'delete-the-team') {
                await deleteTeam(query, teamId, [[]])
                await sendMessageByTeamId(teamId, 'Ваша команда була видалена. Ви можете створити нову команду або приєднатися до іншої. Скористуйтесь командою /start, заново почати роботу');
                await HomeScene(chatId);
            }
            if (query.data === 'quit-the-team') {
                await prisma.user.update({
                    where: {
                        chat_id: chatId
                    },
                    data: {
                        teamCode: ""
                    }
                })
                await sendMessageToUser(chatId, 'Ви покинули команду');
                await HomeScene(chatId);
            }
        }

    })




}

