import { PrismaClient } from "@prisma/client";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, getUserSession, lastInlineMessageId, UserSession } from "../../bot";
import { teamSceneKeyboardLayout } from "../../utils/keyboards/teamSceneLayout";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { createTeamScene } from "./createTeamScene";
import { teamAboutScene } from "./teamAboutScene";
import { joinTeamScene } from "./joinTeamScene";
import { getUserFromDb } from "../../utils/database/userScenes/getUserFromDb";
import { handleKeyboardLayout, startMessage } from "./homeScene";

const prisma = new PrismaClient();


export const teamInfoScene = async (chatId: number, q: CallbackQuery) => {
    const session = getUserSession(chatId);
    const user = await getUserFromDb(chatId);
    const teamId = user?.teamCode;

    if (teamId && q.message?.chat.id === chatId) {
        console.log('teamId', teamId);
        await teamAboutScene(chatId, q, teamId);
    } else {
        if (q.message?.chat.id === chatId) {
            await editInlineKeyboard(q, 'На даний момент ви не маєте команди:', teamSceneKeyboardLayout);
            const layout = await handleKeyboardLayout(chatId)
          
            bot.once('callback_query', async (query: CallbackQuery) => {
                if (query.message?.chat.id === chatId && lastInlineMessageId.get(chatId) === query.message?.message_id)  {
                    console.log(lastInlineMessageId.get(chatId));
                    console.log(query.message?.message_id);
                    if (query.data === 'create_team') {
                        await createTeamScene(chatId, session);
                    }
                    if (query.data === 'join_team') {
                        await joinTeamScene(chatId, session);
                    }

                    if (query.data === 'back') {
                        await editInlineKeyboard(query, startMessage, layout);
                    }
                }

            });

        }
    }

}

