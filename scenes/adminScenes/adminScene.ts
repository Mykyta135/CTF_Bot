import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot, sceneController } from "../../bot";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard"
import { adminLayout } from "../../utils/keyboards/adminLayout";
import { handleTeamsScene } from "./handleTeamsScene";
import { sendMessageAll } from "../../utils/database/adminScenes/sendMessageAll";
import { handleTeamsScenePagination } from "./handleTeamsScenePagination";
import { startEventScene } from "./startEventScene";
import { HomeScene } from "../userScenes/homeScene";
import { handleUsersScene } from "../adminScenes/handleUsersScene";
import { logOfUser } from "../../utils/logOfUser";
import { removeAllListeners } from "../../bot";


export const adminScene = async (message: Message) => {
    bot.removeAllListeners('callback_query');

    logOfUser(message, "Entered Admin Scene");

    createInlineKeyboard(message, "BeParadnishe", adminLayout)

    bot.on('callback_query', (query) => {
        switch (query.data) {
            case 'all_teams':
                handleTeamsScene(message);
                break;
            case 'pagination_all_teams':
                handleTeamsScenePagination(message, query, undefined);
                break;
            case 'start_event':
                startEventScene(query);
                break;
            case 'all_users':
                handleUsersScene(message);
                break;
            case 'send_to_all':
                bot.sendMessage({ chat_id: message.chat.id, text: "Введіть повідомлення яке ви хочете відправити" });
                sendMessageAll();
                break;
        }
    })


}