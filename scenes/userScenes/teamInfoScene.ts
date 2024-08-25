import { PrismaClient } from "@prisma/client";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, sceneController } from "../../bot";
import { teamSceneKeyboardLayout } from "../../utils/keyboards/teamSceneLayout";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { createTeamScene } from "./createTeamScene";
import { teamAboutScene } from "./teamAboutScene";
import { joinTeamScene } from "./joinTeamScene";
import { getUserFromDb } from "../../utils/database/userScenes/getUserFromDb";
import { handleKeyboardLayout, startMessage } from "./homeScene";

const prisma = new PrismaClient();


export const teamInfoScene = async (message: Message, q: CallbackQuery) => {
    const user = await getUserFromDb(message);
    const teamId = user?.teamCode;

    if (teamId) {
        console.log('teamId', teamId);
        teamAboutScene(message, q, teamId);
    } else {
        editInlineKeyboard(q, 'На даний момент ви не маєте команди:', teamSceneKeyboardLayout);


        bot.once('callback_query', (query) => {
            if (query.data === 'create_team') {
                createTeamScene(message);
            }
            if (query.data === 'join_team') {
                joinTeamScene(message);
            }

        });
        if (q.data === 'back') {
            const layout = await handleKeyboardLayout(message)
            editInlineKeyboard(q, startMessage, layout);

        }
    }
}