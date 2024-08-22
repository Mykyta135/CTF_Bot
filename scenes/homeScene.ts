import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../bot";
import { teamInfoScene } from "./teamInfoScene";


import { PrismaClient } from "@prisma/client";
import { homeValidLayout } from "../utils/keyboards/keyboardLayouts/homeValidLayout";
import { getUserAndTeam } from "../utils/database/getUserАndTeam";
import { handleInlineKeyboard } from "../utils/keyboards/inlineKeyboards/handleInlineKeyboard";
import { eventLocationScene } from "./eventLocationScene";
import { adminScene } from "./adminScenes/adminScene";
import { trackTypedMessages } from "../utils/trackTypedMessages";
const prisma = new PrismaClient();


export const HomeScene = async (message: Message, isReturned?: boolean, query?: CallbackQuery,) => {

    bot.removeAllListeners('callback_query');

    const { user, team } = await getUserAndTeam(message.chat.id);

    if (!isReturned) {
        handleInlineKeyboard(message, user, team, false);
    } else if (query) {
        handleInlineKeyboard(query, user, team, true);
    }
    bot.on('message', async (msg) => {
        trackTypedMessages(msg, 5000, 5);
        if (msg.text === 'ParadaParadnaNaParadniyParadi') {
            await adminScene(msg);
        }

    })
    bot.on('callback_query', async (query) => {
        if (query.data === 'my_team') {
            await teamInfoScene(message, query);
        }
        if (query.data === 'event_location') {
            await eventLocationScene(query);
        }

    });
}