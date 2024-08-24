import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot, initialScene } from "../../bot";
import { createInlineKeyboard } from "../../utils/keyboards/inlineKeyboards/createInlineKeyboard"
import { adminLayout } from "../../utils/keyboards/keyboardLayouts/adminLayout";
import { handleTeamsScene } from "./handleTeamsScene";
import { sendMessageAll } from "../../utils/database/adminsDatabase/sendMessageAll";
import { handleTeamsScenePagination } from "./handleTeamsScenePagination";
import { startEventScene } from "./startEventScene";
import { HomeScene } from "../homeScene";
import { handleUsersScene } from "../adminScenes/handleUsersScene";
import { logOfUser } from "../../utils/logOfUser";



export const adminScene = async (message: Message, isUserBlocked: Map<number, boolean>, userStateCache?: Map<number, string>) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');

    await logOfUser(message, "Entered Admin Scene");

    createInlineKeyboard(message, "BeParadnishe", adminLayout)

    bot.on('callback_query', async (query) => {
        switch (query.data) {
            case 'all_teams':
                await handleTeamsScene(message, query, isUserBlocked!);
                break;
            case 'pagination_all_teams':
                await handleTeamsScenePagination(message, query, undefined, isUserBlocked!);
                break;
            case 'start_event':
                await startEventScene(query);
                break;
            case 'all_users':
                await handleUsersScene(message, isUserBlocked!, userStateCache!);
                break;
            case 'send_to_all':
                bot.sendMessage({ chat_id: message.chat.id, text: "Введіть повідомлення яке ви хочете відправити" });
                await sendMessageAll();
                break;
        }
    })
    bot.on('message', async (message) => {
        if (message.text === '/start') {
            await initialScene(message);
        }

    })
}