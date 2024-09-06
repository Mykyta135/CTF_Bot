import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot, userSessions } from "../../bot";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard"
import { adminLayout } from "../../utils/keyboards/adminLayout";
import { handleTeamsScene } from "./handleTeamsScene";
import { sendMessageAll } from "../../utils/database/adminScenes/sendMessageAll";
import { startEventScene } from "./startEventScene";
import { handleCallbackQuery, HomeScene, removeUnneceseryListeners } from "../userScenes/homeScene";
import { handleUsersScene } from "../adminScenes/handleUsersScene";
import { logOfUser } from "../../utils/logOfUser";


export let currentAdminListener: (query: any) => void;

export const adminScene = async (chatId: number) => {
    

    // logOfUser(message, "Entered Admin Scene");

    createInlineKeyboard(chatId, "BeParadnishe", adminLayout);

    removeUnneceseryListeners(handleCallbackQuery, currentAdminListener);

    currentAdminListener = (query) => {
        if (query.message?.chat.id === chatId) {
            switch (query.data) {
                case 'all_teams':
                    handleTeamsScene(chatId);
                    break;
                case 'start_event':
                    startEventScene(query);
                    break;
                case 'all_users':
                    handleUsersScene(chatId);
                    break;
                case 'send_to_all':
                    bot.sendMessage({ chat_id: chatId, text: "Введіть повідомлення яке ви хочете відправити" });
                    sendMessageAll();
                    break;
                case 'clear_cache':
                    userSessions.clear();
                    bot.sendMessage({ chat_id: chatId, text: "Кеш очищено" });
                    break;
            }
        }
    };

    bot.once('callback_query', currentAdminListener);
};