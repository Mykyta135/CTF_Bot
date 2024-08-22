import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
import { createInlineKeyboard } from "../../utils/keyboards/inlineKeyboards/createInlineKeyboard"
import { adminLayout } from "../../utils/keyboards/keyboardLayouts/adminLayout";
import { handleUsersScene } from "./handleUsersScene";
import { sendMessageAll } from "../../utils/database/adminsDatabase/sendMessageAll";
import { handleUsersScenePagination } from "./handleUsersScenePagination";
import { startEventScene } from "./startEventScene";

export const adminScene = async (message: Message) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');


    createInlineKeyboard(message, "BeParadnishe", adminLayout)

    bot.on('callback_query', async (query) => {
        if (query.data === 'all_users') {
            await handleUsersScene(message, query);
        }
        if (query.data === 'pagination_users') {
            await handleUsersScenePagination(message, query);
        }
        if (query.data === 'start_event') {
            await startEventScene(query);
        }
        if (query.data === 'send_to_all') {
            bot.sendMessage({ chat_id: message.chat.id, text: "Введіть повідомлення яке ви хочете відправити" })
            await sendMessageAll();
        }
    })
}