import { PrismaClient } from "@prisma/client";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { findUsersTeam } from "../utils/database/findUsersTeam";
import { bot } from "../bot";
import { teamSceneKeyboardLayout } from "../utils/keyboards/keyboardLayouts/teamSceneLayout";
import { editInlineKeyboard } from "../utils/keyboards/inlineKeyboards/editInlineKeyboard";
import { HomeScene } from "./homeScene";
import { createTeamScene } from "./createTeamScene";
import { teamAboutScene } from "./teamAboutScene";
import { joinTeamScene } from "./joinTeamScene";

const prisma = new PrismaClient();


export const teamInfoScene = async (message: Message, query: CallbackQuery) => {
    const teamId = await findUsersTeam(message);

    if (teamId) {
        console.log('teamId', teamId);
        await teamAboutScene(message, query, teamId);
    } else {
        editInlineKeyboard(query, 'На даний момент ви не маєте команди:', teamSceneKeyboardLayout);



        bot.once('callback_query', async (query) => {
            if (query.data === 'create_team') {
                await createTeamScene(message);
            }
            if (query.data === 'join_team') {
                await joinTeamScene(message);
            }
            if (query.data === 'back') {
                await HomeScene(message, true, query);
            }
        });
    }
}