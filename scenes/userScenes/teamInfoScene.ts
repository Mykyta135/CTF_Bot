import { PrismaClient } from "@prisma/client";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, getUserSession, UserSession } from "../../bot";
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

    if (teamId) {
        console.log('teamId', teamId);
        teamAboutScene(chatId, q, teamId);
    } else {
        if (session.userState !== 'unregistered') {

            editInlineKeyboard(q, 'На даний момент ви не маєте команди:', teamSceneKeyboardLayout);
            const layout = await handleKeyboardLayout(chatId)

            bot.once('callback_query', (query) => {
                if (query.message.chat.id === chatId) {
                    if (query.data === 'create_team') {
                        createTeamScene(chatId, session);
                    }
                    if (query.data === 'join_team') {
                        joinTeamScene(chatId, session);
                    }

                    if (query.data === 'back') {

                        editInlineKeyboard(query, startMessage, layout);
                        // session.userState = 'registered';
                    }
                }

            });

        }
        else {
            editInlineKeyboard(q, "Щоб створити команду або доєднатися до неї, будь ласка зареєструйтесь", []);
        }
        bot.once('message', async (msg) => {
            if (msg.text === '/start') {
                session.userState = "registered"
            }
        })
    }

}
