import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../bot";

import { HomeScene } from "./homeScene";
import { teamInfo } from "../utils/database/teamInfo";
import { editInlineKeyboard } from "../utils/keyboards/inlineKeyboards/editInlineKeyboard";
import { teamAboutLayout } from "../utils/keyboards/keyboardLayouts/teamAboutLayout";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const teamAboutScene = async (message: Message, query: CallbackQuery, teamId: any) => {
    const teamAboutString = await teamInfo(teamId);
    editInlineKeyboard(query, teamAboutString, teamAboutLayout);

    bot.once('callback_query', async (query) => {
        if (query.data === 'back') {
            await HomeScene(message, true, query);
        }
    });


}

