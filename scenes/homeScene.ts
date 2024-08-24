import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, initialScene } from "../bot";
import { teamInfoScene } from "./teamInfoScene";


import { PrismaClient } from "@prisma/client";
import { homeValidLayout } from "../utils/keyboards/keyboardLayouts/homeValidLayout";
import { getUserAndTeam } from "../utils/database/getUserАndTeam";
import { handleInlineKeyboard } from "../utils/keyboards/inlineKeyboards/handleInlineKeyboard";
import { eventLocationScene } from "./eventLocationScene";
import { adminScene } from "./adminScenes/adminScene";
import { trackSpamFromUser } from "../utils/trackSpamFromUser";
import { logOfUser } from "../utils/logOfUser";
import { isBlock } from "typescript";
const prisma = new PrismaClient();


export const HomeScene = async (message: Message, isUserBlocked: Map<number, boolean>, isReturned?: boolean, query?: CallbackQuery,) => {
    bot.removeAllListeners('callback_query');
    bot.removeAllListeners('message');
    logOfUser(message, "entered home scene");
    const { user, team } = await getUserAndTeam(message.chat.id);

    if (!isReturned) {
        handleInlineKeyboard(message, user, team, false);
    } else if (query) {
        handleInlineKeyboard(query, user, team, true);
    }

    bot.on('callback_query', async (query) => {
        if (query.data === 'my_team') {
            await teamInfoScene(message, query);
        }
        if (query.data === 'event_location') {
            await eventLocationScene(query);
        }
    });
    bot.once('message', async (message) => {
        if (message.text === '/start') {
            await initialScene(message);
        }
        if (message.text === '/ParadaParadnaNaParadniyParadi') {
            await adminScene(message, isUserBlocked);
        }
    })

    // return;
}