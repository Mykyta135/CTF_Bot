import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../utils/keyboards/inlineKeyboards/editInlineKeyboard";
import { bot } from "../bot";
import { HomeScene } from "./homeScene";

export const eventLocationScene = async (query: CallbackQuery) => {

    bot.removeAllListeners('callback_query');
    editInlineKeyboard(query, "Змагання у твоєї мамаши вдома", [[{ text: 'Назад', callback_data: 'back' }]]);

    bot.on('callback_query', async (query) => {
        if (query.data === 'back') {
            await HomeScene(query.message!, true, query);
        }
    })

}





