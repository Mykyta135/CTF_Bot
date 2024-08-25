import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, sceneController } from "../../bot";

import { teamInfo } from "../../utils/database/userScenes/teamInfo";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { teamAboutLayout } from "../../utils/keyboards/teamAboutLayout";
import { PrismaClient } from "@prisma/client";
import { handleKeyboardLayout } from "./homeScene";

import { startMessage } from "./homeScene";
const prisma = new PrismaClient();

export const teamAboutScene = async (message: Message, query: CallbackQuery, teamId: any) => {
    const teamAboutString = await teamInfo(teamId);
    editInlineKeyboard(query, teamAboutString, teamAboutLayout);

    if (query.data === 'back') {
        editInlineKeyboard(query, startMessage, await handleKeyboardLayout(message));
    }




}

